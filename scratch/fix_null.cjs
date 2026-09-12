const fs = require('fs');
const file = 'src/services/contentService.js';
let data = fs.readFileSync(file, 'utf8');

// Remove null bytes and clean up string
data = data.replace(/\x00/g, '');

fs.writeFileSync(file, data, 'utf8');
