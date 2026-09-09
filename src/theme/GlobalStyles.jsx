// Carrega as fontes do design system e reset mínimo.
// Space Grotesk -> títulos (caráter técnico/científico)
// IBM Plex Sans -> corpo de texto (legibilidade)
export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; font-family: 'IBM Plex Sans', sans-serif; background-color: #071A1D; color: #F4FDFC; }
      .bs-display { font-family: 'Space Grotesk', sans-serif; }
      .bs-scroll::-webkit-scrollbar { display: none; }
      .bs-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      
      .markdown-content h1 { font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; margin-top: 0; margin-bottom: 0.5rem; color: #2DD4BF; }
      .markdown-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #F4FDFC; }
      .markdown-content p { margin-top: 0; margin-bottom: 1rem; color: #9CC7C4; }
      .markdown-content ul { margin-top: 0; margin-bottom: 1rem; padding-left: 1.5rem; color: #9CC7C4; }
      .markdown-content li { margin-bottom: 0.5rem; }
    `}</style>
  );
}
