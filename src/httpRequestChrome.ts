import axios from "axios";
import * as path from "path";
import * as fs from "fs";
import * as crypto from "crypto-js";
import * as URL from "url";
import * as tarFs from "tar-fs";

async function fetch(cwd: string): Promise<void> {
  try {
    const url = `https://commondatastorage.googleapis.com/chromium-browser-snapshots/Mac/786649/chrome-mac.zip`;
    const method = "GET";

    const response = await axios({
      method,
      url,
      responseType: "stream",
    });

    const axiosStream = response.data;
    if (!axiosStream) {
      throw new Error("Unable download Chrome.");
    }

    fs.mkdirSync(cwd, { recursive: true });
    const fsStream = fs.createWriteStream(path.join(cwd, `chrome.zip`));

    axiosStream.pipe(fsStream);

    const downloadPromise = new Promise((resolve, reject) => {
      fsStream.on("finish", () => resolve());
      fsStream.on("error", (error) => reject(error));
    });

    await downloadPromise;
  } catch (error) {
    throw new Error(error);
  }
}

(async () => {
  const testFolderGenerator = (i: number) =>
    path.join(__dirname, "..", "testFolder", "httpRequestChrome", i.toString());

  console.log("Starting 50 concurrent fetch commands using http of Chrome");

  const to = setTimeout(async () => {
    console.error("Hang.");
    process.exit(1);
  }, 30 * 60 * 1000);

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
