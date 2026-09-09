import os
import re

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements based on new tokens
    replacements = {
        r'theme\.inkSoft': 'theme.textSecondary',
        r'theme\.ink': 'theme.text',
        r'theme\.tealDeep': 'theme.card', # Darker teal to card
        r'theme\.tealTint': 'theme.surface',
        r'theme\.teal': 'theme.primary',
        r'theme\.amberTint': 'theme.surface',
        r'theme\.amber': 'theme.primary', # or secondary
        # Colors that were hardcoded for dark/light themes
        r'"#101E1D"': 'theme.text',
        r'"#4E625F"': 'theme.textSecondary',
        r'"#0B5D5A"': 'theme.primary',
        r'"#F3F7F6"': 'theme.bg',
        r'"#FFFFFF"': 'theme.surface',
        r'"#083F3D"': 'theme.card',
        r'"#DCE7E4"': 'theme.line',
        r'color:\s*"#fff"': 'color: theme.text',
        r'color:\s*"#BFE0DC"': 'color: theme.textSecondary',
        r'background:\s*"rgba\(255,255,255,0\.1\)"': 'background: "rgba(255,255,255,0.05)"',
        r'"rgba\(255,255,255,0\.18\)"': '"rgba(255,255,255,0.15)"',
        r'background:\s*"#fff"': 'background: theme.surface',
    }

    new_content = content
    for old, new in replacements.items():
        new_content = re.sub(old, new, new_content)

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            update_file(os.path.join(root, file))

