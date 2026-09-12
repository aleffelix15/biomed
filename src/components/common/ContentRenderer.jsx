import React from 'react';
import { marked } from 'marked';
import ScientificFigure from './ScientificFigure';

export default function ContentRenderer({ blocks, fallbackMarkdown }) {
  // Se não houver blocos estruturados, fazemos fallback pro formato antigo de markdown puro
  if (!blocks || !Array.isArray(blocks)) {
    if (!fallbackMarkdown) return <p>Sem conteúdo cadastrado.</p>;
    const html = marked.parse(fallbackMarkdown);
    return <div dangerouslySetInnerHTML={{ __html: html }} style={{ lineHeight: 1.6 }} />;
  }

  return (
    <div className="content-renderer" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {blocks.map((block, idx) => {
        if (block.type === 'markdown') {
          const html = marked.parse(block.value || '');
          return <div key={idx} dangerouslySetInnerHTML={{ __html: html }} style={{ lineHeight: 1.6 }} />;
        }
        if (block.type === 'scientific_image') {
          return (
            <ScientificFigure 
              key={idx}
              src={block.src}
              alt={block.alt}
              caption={block.caption}
              credit={block.credit}
              zoomable={block.zoomable}
              type={block.type_img}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
