const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const generateDeepZoomTiles = async (inputFilePath, outputFolder, filename) => {
  try {
    const targetDir = path.join(outputFolder, 'tiles', filename);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Cuts your image into a 256x256 pixel grid pyramid
    await sharp(inputFilePath)
      .tile({
        size: 256,
        overlap: 1,
        layout: 'dz', // Deep Zoom standard format (.dzi)
        format: 'jpg',
        quality: 90
      })
      .toFile(path.join(targetDir, `${filename}.dzi`));

    return {
      dziUrl: `/public/tiles/${filename}/${filename}.dzi`
    };
  } catch (error) {
    console.error('❌ Sharp tiling failed:', error);
    throw error;
  }
};

module.exports = { generateDeepZoomTiles };