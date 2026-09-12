const fs = require('fs');
const path = require('path');

const file = 'src/content/disciplines/bioquimica/topics/glicose/topic.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

data.modules.forEach(mod => {
    mod.lessons.forEach(lesson => {
        if (lesson.content_markdown && !lesson.content_markdown.includes('[DRAFT - PENDENTE DE REVISÃO MÉDICA/CIENTÍFICA]')) {
            lesson.content_markdown = '> **[DRAFT - PENDENTE DE REVISÃO MÉDICA/CIENTÍFICA]** Este conteúdo está em elaboração e não foi validado clinicamente.\n\n' + lesson.content_markdown;
        }
    });
});

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
