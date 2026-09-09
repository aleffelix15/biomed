import * as LucideIcons from 'lucide-react';

export function resolveIcon(iconName) {
  // If it's already a component (mock fallback), return it
  if (typeof iconName === 'function' || typeof iconName === 'object') return iconName;
  
  // Resolve string name to component
  const IconComponent = LucideIcons[iconName];
  return IconComponent || LucideIcons.HelpCircle;
}
