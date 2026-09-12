const fs = require('fs');
const file = 'src/screens/Study/StudyScreen.jsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
    'onClick={() => { setSelectedDisc(d); setTopics(content.getTopicsByDiscipline(d.id)); setStep(\"topic-selection\"); }}',
    'onClick={async () => { setSelectedDisc(d); setTopics(await content.getTopicsByDiscipline(d.id)); setStep(\"topic-selection\"); }}'
);

fs.writeFileSync(file, data, 'utf8');
