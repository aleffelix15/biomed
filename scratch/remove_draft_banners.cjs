const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            if (file.endsWith('.json') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('src/content');
let updatedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // As seen in topic.json:
    // "> **[DRAFT - PENDENTE DE REVIS\u01dfO M\u0089DICA/CIENT\u008fFICA]** Este conte\u01e7do est\u01ad em elabora\u01e7\u01dco e n\u01dco foi validado clinicamente.\n\n"
    // Because of encoding issues when I ran 'cat' earlier, there might be weird characters. 
    // Let's just use a regex that matches the structure.
    const regex = /> \*\*\[DRAFT - PENDENTE DE REVIS.*?CIENT.*?FICA\]\*\* Este conte.*?do est.*? em elabora.*?o e n.*?o foi validado clinicamente\.\\n\\n/g;
    const regex2 = /> \*\*\[DRAFT - PENDENTE DE REVIS.*?CIENT.*?FICA\]\*\* Este conte.*?do est.*? em elabora.*?o e n.*?o foi validado clinicamente\.\n\n/g;
    
    // Also a generic one for any variation
    const regex3 = /> \*\*\[DRAFT.*?\]\*\*.*?\n\n/g;
    const regex4 = /> \*\*\[DRAFT.*?\]\*\*.*?\\n\\n/g;

    content = content.replace(regex, '');
    content = content.replace(regex2, '');
    content = content.replace(regex3, '');
    content = content.replace(regex4, '');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
        console.log(`Updated: ${file}`);
    }
});

console.log(`Total files updated: ${updatedCount}`);
