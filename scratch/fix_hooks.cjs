const fs = require('fs');
const file = 'src/screens/Study/StudyScreen.jsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /useEffect\(\(\) => \{\s*const saveProva = async \(\) => \{[^}]+try \{.*?await Promise\.all.*?await saveStudySession.*?catch.*?\}\s*saveProva\(\);\s*\}, \[\]\);/s;
const match = data.match(regex);

if (match) {
  // Remove from the bottom
  data = data.replace(match[0], '');

  // Add to the top
  const replacement = \
  // Save Exam Mode
  const [alreadySaved, setAlreadySaved] = useState(false);
  useEffect(() => {
    if (step === "finished" && mode === "prova" && !alreadySaved && items.length > 0) {
      const saveProva = async () => {
        try {
          await Promise.all(items.map((q, idx) => {
            const opt = examAnswers[idx]?.selected;
            if (opt) return saveQuestionAttempt(user?.id, q, opt).catch(e => console.error(e));
            return Promise.resolve();
          }));
          
          await saveStudySession({
            userId: user?.id,
            disciplineId: selectedDisc?.id,
            topicId: selectedTopic,
            mode: 'prova',
            totalQuestions: items.length,
            correctCount: items.filter((q, idx) => examAnswers[idx]?.selected === q.correct_option).length,
            timeSpentSeconds: 15 * 60 - timeLeft,
            answers: examAnswers
          });
          setAlreadySaved(true);
        } catch (err) {
          console.error("Error saving exam", err);
        }
      };
      saveProva();
    }
  }, [step, mode, alreadySaved, items, examAnswers, timeLeft, user, selectedDisc, selectedTopic]);
\;

  data = data.replace('// Exam Mode State', replacement + '\\n  // Exam Mode State');
  fs.writeFileSync(file, data, 'utf8');
}
