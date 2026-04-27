import { createReadStream, createWriteStream, read, readFile } from "fs";
import { createInterface } from "readline";
import { pipeline, Transform } from "stream";

const filename = "largeFile.csv";

// async function brokenApp() {
//   await readFile(filename, "utf-8", (err, data) => {
//     if (err) {
//       console.error("Error reading file:", err);
//       return;
//     }
//     console.log("File content:", data);
//   });
// }

function readLargeFile(filename: string = "largeFile.csv") {
  const readStream = createReadStream(filename, "utf-8");
  readStream.on("data", (chunk) => {
    console.log(chunk);
  });
}

function transformData(line: string) {
  const parts = line.split(",");
  if (parts.length === 3) {
    parts[0] = parts[0].toUpperCase();
    parts[1] = parts[1].toUpperCase();

    const alterationDate = new Date().toISOString();

    return [...parts, alterationDate, "\n"].join(",");
  }

  return line + "\n";
}

async function processCsvFile(inputFile: string, outputFile: string) {
  try {
    const readStream = createReadStream(inputFile, "utf-8");
    const writeStream = createWriteStream(outputFile, "utf-8");
    const lineReader = createInterface({ input: readStream });
    const transformStream = new Transform({
      objectMode: true,
      transform(chunk: string, encoding, callback) {
        callback(null, transformData(chunk));
      },
    });

    pipeline(lineReader, transformStream, writeStream, (err) => {
      if (err) {
        console.error("Pipeline failed:", err);
      } else {
        console.log("Pipeline succeeded, file transformed.");
      }
    });
  } catch (err) {
    console.error("Error processing file:", err);
  }
}

// processCsvFile(filename, "transformedFile.csv");
readLargeFile("transformedFile.csv");
