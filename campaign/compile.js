const path = require('path');
const fs = require('fs');
const solc = require('solc');

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Campaign'];