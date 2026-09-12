const fs = require('fs');
const file = 'src/screens/Study/StudyScreen.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'await updateFlashcardProgress(user.id, card.id, evaluation);',
    'await ensureFlashcardExists(card);\n      await updateFlashcardProgress(user.id, card.id, evaluation);'
);

fs.writeFileSync(file, content, 'utf8');
