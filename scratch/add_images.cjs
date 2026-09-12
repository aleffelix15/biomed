const fs = require('fs');

const file = 'src/content/disciplines/imagenologia/topics/metodos-imagem-diagnostica/topic.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

data.modules.forEach(mod => {
    mod.lessons.forEach(lesson => {
        if (lesson.id === 'les_ima_1_1') {
            lesson.images = [
                {
                    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Normal_posteroanterior_%28PA%29_chest_radiograph_%28X-ray%29.jpg',
                    caption: 'Radiografia de tórax em PA normal.',
                    source: 'Wikimedia Commons / Mikael Häggström',
                    license: 'CC0'
                }
            ];
        }
        if (lesson.id === 'les_ima_2_2') {
            lesson.images = [
                {
                    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Brain_regions_on_T1_MRI.png',
                    caption: 'Ressonância Magnética (RM) do encéfalo na sequência T1, onde o líquido cefalorraquidiano (LCR) aparece escuro.',
                    source: 'Wikimedia Commons / Hongwei Zhao et al.',
                    license: 'CC BY 4.0'
                },
                {
                    url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Brain-T2-axial.png',
                    caption: 'Ressonância Magnética (RM) axial na sequência T2, evidenciando o líquido cefalorraquidiano (LCR) claro (hiperintenso).',
                    source: 'Wikimedia Commons / Sean Novak',
                    license: 'CC BY-SA 4.0'
                }
            ];
        }
    });
});

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
