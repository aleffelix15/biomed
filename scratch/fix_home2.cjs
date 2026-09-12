const fs = require('fs');
const file = 'src/screens/Home/HomeScreen.jsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace('import { useAuth } from "../../state/AuthContext";', 'import { useAuth } from "../../state/AuthContext";\\nimport { useCachedQuery } from "../../state/DataCacheContext";');

data = data.replace(/const \[disciplines, setDisciplines\] = useState\(\[\]\);\s*const \[stats, setStats\] = useState\(null\);\s*const \{ user, profile \} = useAuth\(\);\s*const \[loading, setLoading\] = useState\(true\);\s*useEffect\(\(\) => \{[^}]+\}\}, \[user\]\);/s,
\const { user, profile } = useAuth();
  const { data: discData, loading: loadingDisc } = useCachedQuery(user ? 'disciplines:' + user.id : null, () => fetchDisciplinesWithProgress(user.id));
  const { data: statsData, loading: loadingStats } = useCachedQuery(user ? 'stats:' + user.id : null, () => fetchGlobalStats(user.id));
  const disciplines = discData || [];
  const stats = statsData || null;
  const loading = loadingDisc || loadingStats;\
);

fs.writeFileSync(file, data, 'utf8');
