const fs = require('fs');
const file = 'src/screens/Study/StudyScreen.jsx';
let data = fs.readFileSync(file, 'utf8');

// 1. Add DataCacheContext import
data = data.replace('import { useAuth } from "../../state/AuthContext";', 'import { useAuth } from "../../state/AuthContext";\\nimport { useCachedQuery } from "../../state/DataCacheContext";');

// 2. Fix the initial fetch and use Cached Query
const statesToReplace = \  const [disciplines, setDisciplines] = useState([]);
  const [selectedDisc, setSelectedDisc] = useState(null);\;
const statesReplacement = \  const { data: discData } = useCachedQuery(user ? 'disciplines:' + user.id : null, () => fetchDisciplinesWithProgress(user.id));
  const disciplines = discData || [];
  const [selectedDisc, setSelectedDisc] = useState(null);\;
data = data.replace(statesToReplace, statesReplacement);

data = data.replace(/useEffect\(\(\) => \{\\s*fetchDisciplinesWithProgress\\(user\\?\\.id\\)\\.then\\(setDisciplines\\);\\s*\\}, \\[user\\]\\);/, '');

// 3. Move the useEffect out of the finished conditional
const nestedUseEffect = /useEffect\(\(\) => \{\\s*const saveProva = async \(\) => \{[\\s\\S]*?saveProva\(\);\\s*\}, \[\]\);/g;
data = data.replace(nestedUseEffect, '');

// 4. Inject it below the Exam Mode states
const targetInject = \const [examAnswers, setExamAnswers] = useState([]);\;
const injectEffect = \const [examAnswers, setExamAnswers] = useState([]);
  const [alreadySaved, setAlreadySaved] = useState(false);

  useEffect(() => {
    if (step === "finished" && mode === "prova" && !alreadySaved && items.length > 0) {
      const saveProva = async () => {
        let correct = 0;
        items.forEach((q, idx) => {
          if (examAnswers[idx]?.selected === q.correct_option) correct++;
        });
        try {
          await Promise.all(items.map((q, idx) => {
            const opt = examAnswers[idx]?.selected;
            if (opt) return saveQuestionAttempt(user.id, q, opt).catch(e => console.error(e));
            return Promise.resolve();
          }));
          
          await saveStudySession({
            user_id: user.id,
            discipline_id: selectedDisc?.id,
            topic_id: selectedTopic,
            mode: mode,
            score_percent: Math.round((correct / items.length) * 100),
            correct_count: correct,
            total_count: items.length,
            duration_seconds: 600 - timeLeft
          });
          setAlreadySaved(true);
        } catch(e) {
          console.error("Error saving exam:", e);
        }
      };
      saveProva();
    }
  }, [step, mode, alreadySaved, items, examAnswers, timeLeft, user, selectedDisc, selectedTopic]);
\;
data = data.replace(targetInject, injectEffect);

fs.writeFileSync(file, data, 'utf8');
