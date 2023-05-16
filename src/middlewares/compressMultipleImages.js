const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const compressImage = async (req, res, next) => {
    if (req.files) {
      try {
        // Iterate through each uploaded file
        for (let i = 0; i < req.files.length; i++) {
          const filePath = req.files[i].path;
          const fileExt = path.extname(filePath);
          const compressedFilePath = filePath.replace(fileExt, '_compressed.jpg');
  
          await sharp(filePath)
            .resize({ width: 800 })
            .withMetadata() 
            .jpeg({ quality: 80 })
            .toFile(compressedFilePath);
  
          // Remove the original file from disk
          fs.unlinkSync(filePath);
  
          // Update the req.files array to point to the compressed file
          req.files[i].path = compressedFilePath;
          req.files[i].destination = path.dirname(compressedFilePath);
          req.files[i].filename = path.basename(compressedFilePath);
        }
      } catch (err) {
        return next(err);
      }
    }
  
    next();
  };
  

module.exports = compressImage;
