import './responsive.css';

export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
      
      :root {
        /* DARK MODE (Default - UI/UX 2.0) */
        --theme-bg: #030B1C;         /* Fundo navy muito escuro */
        --theme-surface: #0A1633;    /* Superficíe azul-marinho */
        --theme-card: #0F1E40;       /* Card azul-marinho um pouco mais claro */
        --theme-primary: #1CE679;    /* Verde success/action principal (emerald/green) */
        --theme-secondary: #00D2D3;  /* Cyan actions secundárias */
        --theme-accent: #8E44AD;     /* Roxo destaque */
        --theme-accent-light: #B586F8; /* Lilás */
        
        --theme-text: #FFFFFF;
        --theme-text-secondary: #8BA0C7;
        --theme-muted: #56688A;
        --theme-line: #182A52;       /* Bordas sutis */
        
        --theme-danger: #FF4757;
        --theme-warning: #FFA502;
        --theme-info: #1E90FF;
        
        /* Markdown overrides */
        --md-h1: #1CE679;
        --md-h2: #FFFFFF;
        --md-p: #8BA0C7;
      }
      
      :root[data-theme="light"] {
        /* LIGHT MODE (Alinhado à nova identidade, embora Dark seja o foco principal) */
        --theme-bg: #F5F7FA;
        --theme-surface: #FFFFFF;
        --theme-card: #FFFFFF;
        --theme-primary: #00B894;
        --theme-secondary: #00CEC9;
        --theme-accent: #6C5CE7;
        --theme-accent-light: #A29BFE;
        
        --theme-text: #2D3436;
        --theme-text-secondary: #636E72;
        --theme-muted: #B2BEC3;
        --theme-line: #DFE6E9;
        
        --theme-danger: #D63031;
        --theme-warning: #FDCB6E;
        --theme-info: #0984E3;
        
        --md-h1: #00B894;
        --md-h2: #2D3436;
        --md-p: #636E72;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        -webkit-tap-highlight-color: transparent;
      }

      body {
        background-color: var(--theme-bg);
        color: var(--theme-text);
        font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        overflow-x: hidden;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        line-height: 1.2;
      }

      button {
        font-family: inherit;
        border: none;
        outline: none;
        cursor: pointer;
        background: none;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      input, textarea {
        font-family: inherit;
      }

      /* Utilitários globais de scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--theme-line);
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--theme-muted);
      }

      /* TEMA SALA DE CONTROLE NOTURNA (Objetivo 2) */
      .theme-nocturne {
        --theme-bg: #05050A;
        --theme-surface: #0A0A14;
        --theme-card: #10101C;
        --theme-primary: #3B82F6;
        --theme-secondary: #60A5FA;
        --theme-accent: #2563EB;
        --theme-accent-light: #93C5FD;
        
        --theme-text: #F8FAFC;
        --theme-text-secondary: #94A3B8;
        --theme-muted: #475569;
        --theme-line: #1E293B;
        
        --md-h1: #3B82F6;
        --md-h2: #F8FAFC;
        --md-p: #94A3B8;
      }
    `}</style>
  );
}
