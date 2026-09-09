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
    `}</style>
  );
}
