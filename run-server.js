const fs = require('fs');
const path = require('path');

const ENTRY = path.join(__dirname, 'server.js');

if (!fs.existsSync(ENTRY)) {
  console.error('Entry file not found:', ENTRY);
  process.exit(1);
}

if (path.extname(ENTRY) !== '.js') {
  console.error('Refusing to run non-JS entry:', ENTRY);
  process.exit(1);
}

require(ENTRY);
