const fs = require('fs');
const path = require('path');

console.log('=== DEBUG START ===');
console.log('Current Directory:', process.cwd());

try {
    const files = fs.readdirSync('.');
    console.log('Root Files:', files);

    if (files.includes('app')) {
        console.log('App directory found!');
        try {
            console.log('App contents:', fs.readdirSync('app'));
        } catch (err) {
            console.log('Error reading app dir:', err.message);
        }
    } else {
        console.error('ERROR: App directory NOT found in root!');
    }
} catch (e) {
    console.error('Debug Error:', e);
}
console.log('=== DEBUG END ===');
