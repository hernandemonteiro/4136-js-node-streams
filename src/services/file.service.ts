import { createReadStream, readFile } from "fs";

const filename = "largeFile.csv";

async function brokenApp() {
  await readFile(filename, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    console.log("File content:", data);
  });
}

function readLargeFile() {
  const readStream = createReadStream(filename, "utf-8");
  readStream.on("data", (chunk) => {
    console.log(chunk);
  });
}

readLargeFile();
