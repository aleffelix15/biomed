const fs = require('fs');

const files = [
  'src/components/ui/Badge.jsx',
  'src/screens/Auth/LoginScreen.jsx',
  'src/screens/Lesson/LessonScreen.jsx',
  'src/screens/Quiz/QuizScreen.jsx',
  'src/screens/Study/StudyScreen.jsx',
  'src/screens/StudyPlan/StudyPlanScreen.jsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');
  if (code.match(/\$\{theme\.[a-zA-Z]+\}[0-9a-fA-F]{2}/)) {
    if (!code.includes('alpha')) {
      code = code.replace(/import \{ theme \}/, 'import { theme, alpha }');
    }
    // Replace `${theme.primary}22` -> alpha(theme.primary, '22')
    code = code.replace(/`\$\{theme\.([a-zA-Z]+)\}([0-9a-fA-F]{2})`/g, "alpha(theme.$1, '$2')");
    fs.writeFileSync(f, code);
  }
});
