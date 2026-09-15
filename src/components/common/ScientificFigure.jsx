import React, { useState } from 'react';
import { theme } from '../../theme/tokens';
import { ImageOff, Maximize2, Minimize2 } from 'lucide-react';

export default function ScientificFigure({ 
  src, 
  alt, 
  caption, 
  credit, 
  zoomable = false, 
  type = 'diagram' // 'diagram' | 'microscopy' | 'photo'
}) {
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const getProxiedSrc = (url) => {
    if (url && url.includes('upload.wikimedia.org')) {
      const cleanUrl = url.replace(/^https?:\/\//, '');
      return `https://wsrv.nl/?url=${cleanUrl}`;
    }
    return url;
  };

  const getDirectWikiSrc = (url) => {
    if (url && url.includes('upload.wikimedia.org')) {
      // Wikimedia frequently changes image hashes, breaking hardcoded URLs (404).
      // Special:FilePath always redirects to the latest active hash.
      const filename = url.split('/').pop();
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;
    }
    return url;
  };

  const proxiedSrc = getProxiedSrc(src);
  const directSrc = getDirectWikiSrc(src);

  const [currentSrc, setCurrentSrc] = useState(proxiedSrc);

  const handleError = () => {
    if (currentSrc === proxiedSrc && directSrc && currentSrc !== directSrc) {
      setCurrentSrc(directSrc); // Tenta a URL direta (via Special:FilePath) se o proxy falhar
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <figure style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: theme.surface, border: `1px dashed ${theme.line}`, borderRadius: 12, padding: 32, margin: '24px 0' }}>
        <ImageOff size={32} color={theme.textSecondary} />
        <figcaption style={{ color: theme.textSecondary, fontSize: 13, marginTop: 12, textAlign: 'center' }}>
          Imagem indisponível<br />({alt})
        </figcaption>
      </figure>
    );
  }

  const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: 8,
    objectFit: 'contain',
    maxHeight: isZoomed ? '80vh' : (type === 'microscopy' ? 300 : 400),
    cursor: zoomable ? (isZoomed ? 'zoom-out' : 'zoom-in') : 'default',
    transition: 'max-height 0.3s ease',
    backgroundColor: type === 'diagram' ? 'transparent' : '#000',
  };

  return (
    <figure 
      style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
      onClick={() => zoomable && setIsZoomed(!isZoomed)}
    >
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={handleError}
          style={imageStyles}
        />
        {zoomable && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: '50%', color: '#fff', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isZoomed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </div>
        )}
      </div>
      
      {(caption || credit) && (
        <figcaption style={{ marginTop: 12, textAlign: 'center', maxWidth: '90%' }}>
          {caption && <span style={{ fontSize: 13, color: theme.textSecondary, display: 'block', lineHeight: 1.4 }}>{caption}</span>}
          {credit && <span style={{ fontSize: 11, color: theme.line, display: 'block', marginTop: 4 }}>Fonte: {credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
