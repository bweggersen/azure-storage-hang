import axios from "axios";
import * as path from "path";
import * as crypto from "crypto-js";
import * as URL from "url";
import * as tarFs from "tar-fs";

function hashAndEncode(authSignature: string, storageKey: string): string {
  const signatureBytes = crypto.HmacSHA256(
    authSignature,
    crypto.enc.Base64.parse(storageKey)
  );
  const signatureEncoded = signatureBytes.toString(crypto.enc.Base64);

  return signatureEncoded;
}

function getCanonicalizedHeaders(headers: { [key: string]: string }): string[] {
  return Object.keys(headers)
    .map((key) => `${key}:${headers[key]}`)
    .filter((keyValue) => keyValue.startsWith("x-ms-"))
    .sort();
}

function getCanonicalizedResource(account: string, url: string): string[] {
  return [`/${account}${URL.parse(url).pathname}`];
}

function generateSharedKey({
  method,
  headers,
  account,
  storageKey,
  requestBodyLength,
  url,
}: {
  method: string;
  headers: { [key: string]: string };
  account: string;
  storageKey: string;
  requestBodyLength?: number;
  url: string;
}): string {
  const headerDate = new Date().toUTCString();

  const canonicalizedHeaders = getCanonicalizedHeaders(headers);
  const canonicalizedResource = getCanonicalizedResource(account, url);

  var signatureParts = [
    method,
    headers["content-encoding"] || "",
    headers["content-language"] || "",
    requestBodyLength || "",
    headers["content-md5"] || "",
    headers["content-type"] || "",
    headers["x-ms-date"] ? "" : headerDate || "",
    headers["if-modified-since"] || "",
    headers["if-match"] || "",
    headers["if-none-match"] || "",
    headers["if-unmodified-since"] || "",
    headers["range"] || "",
    ...(canonicalizedHeaders || []),
    ...(canonicalizedResource || []),
  ];

  const signatureRaw = signatureParts.join("\n");
  const signatureEncoded = hashAndEncode(signatureRaw, storageKey);

  return `SharedKey ${account}:${signatureEncoded}`;
}

async function fetch(cwd: string): Promise<void> {
  try {
    const account = process.env.AZURE_STORAGE_ACCOUNT;
    const container = process.env.AZURE_STORAGE_CONTAINER;
    const storageKey = process.env.AZURE_STORAGE_KEY;
    const blobName = process.env.AZURE_BLOB_NAME;

    if (!account || !container || !storageKey || !blobName) {
      throw new Error("Missing env variables.");
    }

    const url = `https://${account}.blob.core.windows.net/${container}/${blobName}`;
    const method = "GET";

    const headers = {
      "x-ms-date": new Date().toUTCString(),
      "x-ms-version": "2018-03-28",
    };

    const response = await axios({
      method,
      url,
      responseType: "stream",
      headers: {
        Authorization: generateSharedKey({
          method,
          headers,
          account,
          storageKey,
          url,
        }),
        ...headers,
      },
    });

    const blobReadableStream = response.data;
    if (!blobReadableStream) {
      throw new Error("Unable to fetch blob.");
    }

    const tarWritableStream = tarFs.extract(cwd);

    blobReadableStream.pipe(tarWritableStream);

    const blobPromise = new Promise((resolve, reject) => {
      tarWritableStream.on("finish", () => resolve());
      tarWritableStream.on("error", (error) => reject(error));
    });

    await blobPromise;
  } catch (error) {
    throw new Error(error);
  }
}

(async () => {
  const testFolderGenerator = (i: number) =>
    path.join(__dirname, "..", "testFolder", "httpRequest", i.toString());

  console.log("Starting 50 concurrent fetch commands using http");

  const to = setTimeout(async () => {
    console.error("Hang.");
    process.exit(1);
  }, 10 * 60 * 1000);

  await Promise.all(
    [...Array(50).keys()].map(async (i) => {
      console.log(`starting #${i}`);
      await fetch(testFolderGenerator(i));
      console.log(`done #${i}`);
    })
  );

  clearTimeout(to);

  console.log("All done");
})();
