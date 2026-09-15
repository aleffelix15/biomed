const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../src/content/disciplines');
const results = [];

async function auditImages() {
  const dirs = fs.readdirSync(contentDir);
  for (const discSlug of dirs) {
    if (discSlug === 'template') continue;
    const topicsDir = path.join(contentDir, discSlug, 'topics');
    if (!fs.existsSync(topicsDir)) continue;
    
    const topicFiles = fs.readdirSync(topicsDir);
    for (const topSlug of topicFiles) {
      const topicPath = path.join(topicsDir, topSlug, 'topic.json');
      if (!fs.existsSync(topicPath)) continue;
      
      const topicData = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
      if (!topicData.modules) continue;
      
      for (const mod of topicData.modules) {
        if (!mod.lessons) continue;
        for (const lesson of mod.lessons) {
          if (!lesson.content_blocks) continue;
          
          for (const block of lesson.content_blocks) {
            if (block.type === 'scientific_image') {
              results.push({
                discipline: discSlug,
                topic: topicData.title || topSlug,
                lesson: lesson.title,
                url: block.src,
                type: block.type_img || 'diagram',
                credit: block.credit || 'Unknown',
              });
            }
          }
        }
      }
    }
  }

  console.log(`Found ${results.length} images to audit. Starting checks...`);
  
  const markdownLines = [
    '# Auditoria de Imagens Científicas',
    '',
    '| Disciplina | Tópico | Aula | Fonte | Status | URL |',
    '|---|---|---|---|---|---|'
  ];

  for (const img of results) {
    let status = 'UNKNOWN';
    try {
      let finalUrl = img.url;
      // Aplica a mesma lógica do fallback
      if (finalUrl && finalUrl.includes('upload.wikimedia.org')) {
        const filename = finalUrl.split('/').pop();
        finalUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(finalUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        status = 'OK';
      } else if (response.status === 404) {
        status = 'BROKEN (404)';
      } else {
        status = `BROKEN (${response.status})`;
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        status = 'TIMEOUT';
      } else {
        status = 'INVALID';
      }
    }
    
    // extrair fonte curta (ex: "OpenStax")
    let shortCredit = img.credit.substring(0, 15) + (img.credit.length > 15 ? '...' : '');
    
    markdownLines.push(`| ${img.discipline} | ${img.topic} | ${img.lesson} | ${shortCredit} | **${status}** | [Link](${img.url}) |`);
    console.log(`Tested: ${img.lesson} -> ${status}`);
  }

  fs.writeFileSync(path.join(__dirname, '../scratch/IMAGE_AUDIT.md'), markdownLines.join('\n'));
  console.log('Audit complete! Wrote to scratch/IMAGE_AUDIT.md');
}

auditImages();

