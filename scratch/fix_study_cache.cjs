const fs = require('fs');
const file = 'src/screens/Study/StudyScreen.jsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace('import { useAuth } from "../../state/AuthContext";', 'import { useAuth } from "../../state/AuthContext";\\nimport { useCachedQuery } from "../../state/DataCacheContext";');

data = data.replace(/const \[disciplines, setDisciplines\] = useState\(\[\]\);\s*/, '');
data = data.replace(/useEffect\(\(\) => \{\s*fetchDisciplinesWithProgress\(user\?\.id\)\.then\(setDisciplines\);\s*\}, \[user\]\);/,
\const { data: discData } = useCachedQuery(user ? 'disciplines:' + user.id : null, () => fetchDisciplinesWithProgress(user.id));
  const disciplines = discData || [];\);

fs.writeFileSync(file, data, 'utf8');
