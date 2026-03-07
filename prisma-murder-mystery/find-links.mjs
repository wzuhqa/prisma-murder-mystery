import fs from 'fs';
import path from 'path';

function findLinks(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findLinks(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.html')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const matches = content.match(/<a\s+[^>]*>/g);
            if (matches) {
                matches.forEach(m => console.log(`${fullPath}: ${m}`));
            }
        }
    }
}

findLinks('src');
