// Design tokens
export const theme = {
  bg: "var(--theme-bg)",
  surface: "var(--theme-surface)",
  card: "var(--theme-card)",
  primary: "var(--theme-primary)",
  secondary: "var(--theme-secondary)",
  accent: "var(--theme-accent)",
  accentLight: "var(--theme-accent-light)",
  text: "var(--theme-text)",
  textSecondary: "var(--theme-text-secondary)",
  muted: "var(--theme-muted)",
  line: "var(--theme-line)",
  danger: "var(--theme-danger)",
  warning: "var(--theme-warning)",
  info: "var(--theme-info)",
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
};

export const alpha = (colorVar, opacityHex) => {
  const percent = Math.round((parseInt(opacityHex, 16) / 255) * 100);
  return `color-mix(in srgb, ${colorVar} ${percent}%, transparent)`;
};
