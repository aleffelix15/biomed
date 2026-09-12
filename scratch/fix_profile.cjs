const fs = require('fs');
const file = 'src/screens/Profile/ProfileScreen.jsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace('import { updateUserProfile, fetchGlobalStats } from "../../services/supabaseService";', 'import { updateUserProfile, fetchGlobalStats } from "../../services/supabaseService";\\nimport { useCachedQuery } from "../../state/DataCacheContext";');

data = data.replace(/const \[stats, setStats\] = useState\(null\);\s*const \[statsLoading, setStatsLoading\] = useState\(true\);\s*useEffect\(\(\) => \{\s*if \(user\) \{\s*setStatsLoading\(true\);\s*fetchGlobalStats\(user\.id\)\.then\(data => \{\s*setStats\(data\);\s*setStatsLoading\(false\);\s*\}\)\.catch\(\(\) => setStatsLoading\(false\)\);\s*\}\s*\}, \[user\]\);/s, 
\const { data: statsData, loading: statsLoading } = useCachedQuery(user ? 'stats:' + user.id : null, () => fetchGlobalStats(user.id));
  const stats = statsData || null;\
);

fs.writeFileSync(file, data, 'utf8');
