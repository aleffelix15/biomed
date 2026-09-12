const fs = require('fs');
const file = 'src/app/App.jsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace('borderBottom: \\1px solid \\\\', 'borderBottom: 1px solid ');

fs.writeFileSync(file, data, 'utf8');
