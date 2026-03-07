const fs = require('fs');
const path = require('path');

function findLinks(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findLinks(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.html')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const matches = content.match(/<a\b[^>]*>/ig);
            if (matches) {
                matches.forEach(m => {
                    if (!m.includes('href="') && !m.includes("href='") && !m.includes("href={")) {
                        console.log(`POTENTIAL ISSUE (No HREF): ${fullPath}: ${m}`);
                    } else if (m.includes('href=""') || m.includes("href=''") || m.includes("href={''}")) {
                        console.log(`POTENTIAL ISSUE (Empty HREF): ${fullPath}: ${m}`);
                    } else if (m.includes('href="#"') || m.includes("href={'#'}")) {
                        console.log(`HAS HASH HREF: ${fullPath}: ${m}`);
                    }
                });
            }
        }
    }
}

findLinks(path.join(__dirname, 'src'));
console.log('Search complete.');
