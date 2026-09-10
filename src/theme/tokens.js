// Design tokens – cor, tipografia e espaçamento do BioStudy.
// Alterado para suportar variáveis CSS (Light/Dark mode) preservando o objeto `theme`.

export const theme = {
  bg: "var(--theme-bg)",
  surface: "var(--theme-surface)",
  card: "var(--theme-card)",
  primary: "var(--theme-primary)",
  secondary: "var(--theme-secondary)",
  accent: "var(--theme-accent)",
  text: "var(--theme-text)",
  textSecondary: "var(--theme-text-secondary)",
  muted: "var(--theme-muted)",
  line: "var(--theme-line)",
  danger: "var(--theme-danger)",
  warning: "var(--theme-warning)",
  info: "var(--theme-info)",
};

export const radius = {
  sm: 16,
  md: 20,
  lg: 24,
  pill: 999,
};

// Helper para substituir concatenações hardcoded como `${theme.primary}22`
// por uma função color-mix suportada nativamente nos navegadores modernos.
export const alpha = (colorVar, opacityHex) => {
  const percent = Math.round((parseInt(opacityHex, 16) / 255) * 100);
  return `color-mix(in srgb, ${colorVar} ${percent}%, transparent)`;
};
