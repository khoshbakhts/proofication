const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, './src/fonts/IRANSans.ttf'); // Your font file
const fontData = fs.readFileSync(fontPath);
const base64Font = fontData.toString('base64');

console.log(base64Font);