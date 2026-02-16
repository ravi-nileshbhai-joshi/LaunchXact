const fs = require('fs');
const path = require('path');

console.log('--- DEBUG BUILD START ---');
console.log('CWD:', process.cwd());

function listDir(dir, level = 0) {
    if (level > 2) return; // Limit depth
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            // Ignore node_modules and .git to keep logs clean
            if (file === 'node_modules' || file === '.git' || file === '.next') return;

            console.log('  '.repeat(level) + ' - ' + file);
            try {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    listDir(fullPath, level + 1);
                }
            } catch (e) { }
        });
    } catch (e) {
        console.log('  '.repeat(level) + 'Error listing ' + dir + ': ' + e.message);
    }
}

listDir('.');
console.log('--- DEBUG BUILD END ---');
