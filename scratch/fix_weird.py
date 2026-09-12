with open('src/screens/Study/StudyScreen.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

import re
# Find anything like order: ... px solid ... and replace with order: '1px solid ' + theme.line (wait, I can just use a generic regex for the whole block)
code = re.sub(r'border: .*?px solid .*?, color:', r'border: 1px solid , color:', code)
code = re.sub(r'border: .*?px solid .*?, marginBottom', r'border: 1px solid , marginBottom', code)
code = re.sub(r'borderBottom: .*?px solid .*?\}', r'borderBottom: 1px solid  }', code)

with open('src/screens/Study/StudyScreen.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
