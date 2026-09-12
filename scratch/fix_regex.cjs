const fs = require('fs');
const file = 'src/services/supabaseService.js';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
    /const topicFiles = import\.meta\.glob.*?\n.*?let targetTopicId = null;\n.*?for \(const path in topicFiles\) \{\n.*?const topic = topicFiles\[path\]\.default;/s,
    'const allTopics = await content.getAllTopics();\n\n  let targetTopicId = null;\n  for (const topic of allTopics) {'
);

fs.writeFileSync(file, data, 'utf8');
