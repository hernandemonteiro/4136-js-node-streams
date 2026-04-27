import { Router } from "express";
import { ensureDirectoryExists, uploadDirectory } from "../utils/helper";
import path from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream";

const videoRouter = Router();

videoRouter.post("/upload/:filename", (req, res) => {
  ensureDirectoryExists(uploadDirectory);
  const filename = req.params.filename;

  if (!filename) {
    return res.status(400).json({ message: "Filename is required" });
  }

  const filePath = path.join(uploadDirectory, filename);
  const writeStream = createWriteStream(filePath);

  pipeline(req, writeStream, (err) => {
    if (err) {
      console.error("Error uploading video:", err);
      return res.status(500).json({ message: "Error uploading video" });
    }

    res
      .status(200)
      .json({ message: "Video uploaded successfully", path: filePath });
  });
});

export { videoRouter };
