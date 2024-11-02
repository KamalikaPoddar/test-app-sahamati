const crypto = require('crypto');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT Secret:', jwtSecret);

// Generate Encryption Key
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('Encryption Key:', encryptionKey);
