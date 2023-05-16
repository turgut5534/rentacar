const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const compressImage = async (req, res, next) => {
    if (req.file) {
        try {
            console.log('Original file:', req.file); // Debugging line
            const filePath = req.file.path;
            const fileExt = path.extname(filePath);
            const compressedFilePath = filePath.replace(fileExt, '_compressed.jpg');

            const compressedImage = await sharp(filePath)
            .resize({ width: 800 })
            .withMetadata() 
            .jpeg({ quality: 80 })
            .toFile(compressedFilePath);

            console.log('Compressed file:', compressedImage); // Debugging line

            // Remove the original file from disk
            fs.unlinkSync(filePath);

            // Update the req.file object to point to the compressed file
            req.file.path = compressedFilePath;
            req.file.destination = path.dirname(compressedFilePath);
            req.file.filename = path.basename(compressedFilePath);

        } catch (err) {
            console.log('___________________________________________')
            return next(err);
        }
    }

    next();
};

module.exports = compressImage;
