const fs = require('fs');
const path = require('path');

const topics = [
    'src/content/disciplines/anatomia/topics/sistema-esqueletico/topic.json',
    'src/content/disciplines/farmacologia/topics/farmacocinetica/topic.json',
    'src/content/disciplines/fisiologia/topics/cardiovascular/topic.json'
];

topics.forEach(file => {
    if (fs.existsSync(file)) {
        let data = JSON.parse(fs.readFileSync(file, 'utf8'));
        let changed = false;

        data.modules.forEach(mod => {
            mod.lessons.forEach(lesson => {
                if (!lesson.clinical_application) {
                    lesson.clinical_application = "[DRAFT - PENDENTE DE REVISÃO MÉDICA] Aplicação clínica em elaboração.";
                    changed = true;
                }
                if (!lesson.summary) {
                    lesson.summary = "[DRAFT - PENDENTE DE REVISÃO MÉDICA] Resumo em elaboração.";
                    changed = true;
                }
                if (!lesson.key_points || lesson.key_points.length === 0) {
                    lesson.key_points = ["[DRAFT - PENDENTE DE REVISÃO]"];
                    changed = true;
                }
            });
        });

        if (changed) {
            fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        }
    }
});
