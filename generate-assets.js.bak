const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets', 'images');

// 1. Pastikan folder assets/images sudah dibuat
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 2. Base64 dari PNG valid warna transparan (1x1 pixel)
const dummyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buffer = Buffer.from(dummyPngBase64, 'base64');

// 3. Daftar file yang dibutuhkan oleh app.json kamu
const targetFiles = ['adaptive-icon.png', 'icon.png', 'splash.png'];

console.log('⏳ Generating dummy assets...');

targetFiles.forEach(file => {
  const filePath = path.join(assetsDir, file);
  fs.writeFileSync(filePath, buffer);
  console.log(`✅ Created: assets/images/${file}`);
});

console.log('🎉 All dummy assets generated successfully!');
