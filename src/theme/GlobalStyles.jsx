import './responsive.css';

export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
      
      :root {
        /* DARK MODE (Default) */
        --theme-bg: #050807;
        --theme-surface: #0B1512;
        --theme-card: #0D1B17;
        --theme-primary: #00E676;
        --theme-secondary: #00BFA5;
        --theme-accent: #39FF88;
        --theme-text: #F2F7F4;
        --theme-text-secondary: #9AAEA5;
        --theme-muted: #64756D;
        --theme-line: #173229;
        --theme-danger: #FF5252;
        --theme-warning: #FFC107;
        --theme-info: #2196F3;
        
        --md-h1: #2DD4BF;
        --md-h2: #F4FDFC;
        --md-p: #9CC7C4;
      }
      
      :root[data-theme="light"] {
        /* LIGHT MODE */
        --theme-bg: #F6F8F7;
        --theme-surface: #FFFFFF;
        --theme-card: #FFFFFF;
        --theme-primary: #00A86B;
        --theme-secondary: #008B57;
        --theme-accent: #00C853;
        --theme-text: #15201B;
        --theme-text-secondary: #53635B;
        --theme-muted: #718078;
        --theme-line: #DCE5E0;
        --theme-danger: #DC2626;
        --theme-warning: #F59E0B;
        --theme-info: #0284C7;
        
        --md-h1: #008B57;
        --md-h2: #15201B;
        --md-p: #404D46;
      }

      * { box-sizing: border-box; }
      body { margin: 0; font-family: 'IBM Plex Sans', sans-serif; background-color: var(--theme-bg); color: var(--theme-text); }
      .bs-display { font-family: 'Space Grotesk', sans-serif; }
      .bs-scroll::-webkit-scrollbar { display: none; }
      .bs-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      
      .markdown-content h1 { font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; margin-top: 0; margin-bottom: 0.5rem; color: var(--md-h1); }
      .markdown-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--md-h2); }
      .markdown-content { word-break: break-word; overflow-wrap: break-word; }
        .markdown-content img { max-width: 100%; height: auto; }
        .markdown-content table { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; }
        .markdown-content pre { overflow-x: auto; }
        .markdown-content p { margin-top: 0; margin-bottom: 1rem; color: var(--md-p); }
      .markdown-content ul { margin-top: 0; margin-bottom: 1rem; padding-left: 1.5rem; color: var(--md-p); }
      .markdown-content li { margin-bottom: 0.5rem; color: var(--md-p); }
    `}</style>
  );
}
