import { BlobServiceClient } from "@azure/storage-blob";
import * as path from "path";
import * as tarFs from "tar-fs";

async function fetch(cwd: string): Promise<void> {
  try {
    const container = process.env.AZURE_STORAGE_CONTAINER;
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobName = process.env.AZURE_BLOB_NAME;

    if (!container || !connectionString || !blobName) {
      throw new Error("Missing env variables.");
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      connectionString
    );
    const containerClient = blobServiceClient.getContainerClient(container);
    const blobClient = containerClient.getBlobClient(blobName);

    const response = await blobClient.download(0);

    const blobReadableStream = response.readableStreamBody;
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
    path.join(__dirname, "..", "testFolder", "azureBlobSDK", i.toString());

  console.log(
    "Starting 50 concurrent fetch commands using @azure/storage-blob"
  );

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
