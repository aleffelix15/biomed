export const formatPercent = (value) => `${Math.round(value)}%`;

export const clampProgress = (value) => Math.max(0, Math.min(100, value));
