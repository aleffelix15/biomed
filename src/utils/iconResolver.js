import { HelpCircle, TestTube, Bone, Dna, Sparkles, FlaskConical, Biohazard, Layers, Egg, Activity, Pill, HeartPulse, Droplet, ScanLine, ShieldCheck, Bug, Microscope, Beaker } from 'lucide-react';

const iconsMap = {
  TestTube, Bone, Dna, Sparkles, FlaskConical, Biohazard, Layers, Egg, Activity, Pill, HeartPulse, Droplet, ScanLine, ShieldCheck, Bug, Microscope, Beaker, HelpCircle
};

export function resolveIcon(iconName) {
  // If it's already a component (mock fallback), return it
  if (typeof iconName === 'function' || typeof iconName === 'object') return iconName;
  
  // Resolve string name to component
  return iconsMap[iconName] || HelpCircle;
}
