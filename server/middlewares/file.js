const multer = require("multer");
const path = require("path");
const generateCode = require("../utils/generateCode");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    const originalFileName = file.originalname;
    const ext = path.extname(originalFileName);
    const FileName = originalFileName.replace(ext, "");
    const compressed = FileName.split(" ").join("_");
    const lowerCased = compressed.toLowerCase();
    const code = generateCode(12);
    const finalFileName = `${lowerCased}_${code}${ext}`;
    req.pic = finalFileName;
    callback(null, finalFileName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",        // ✅ added
      "image/gif",         // ✅ added
      "image/svg+xml",     // ✅ added
      "image/avif",        // ✅ added (modern format)
      "application/pdf",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "Only .jpg, .jpeg, .png, .webp, .gif, .svg, .avif, .pdf are allowed"
        )
      );
    }
  },
});

module.exports = upload;