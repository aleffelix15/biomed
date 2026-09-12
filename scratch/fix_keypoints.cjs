const fs = require('fs');
const path = require('path');

const dir = 'src/content/disciplines';
let fixedCount = 0;
let failedCount = 0;

function traverse(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
        const fullPath = path.join(currentPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (file === 'topic.json') {
            let content = fs.readFileSync(fullPath, 'utf8');
            let data = JSON.parse(content);
            let changed = false;

            data.modules.forEach(mod => {
                mod.lessons.forEach(lesson => {
                    if (typeof lesson.key_points === 'string') {
                        try {
                            lesson.key_points = JSON.parse(lesson.key_points);
                            changed = true;
                            fixedCount++;
                        } catch (e) {
                            console.error('Failed to parse key_points in ' + fullPath + ' lesson: ' + lesson.title);
                            failedCount++;
                        }
                    }
                });
            });

            if (changed) {
                fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
            }
        }
    }
}
traverse(dir);
console.log('Fixed ' + fixedCount + ' lessons. Failed: ' + failedCount);
