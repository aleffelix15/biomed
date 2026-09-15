const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const contentDir = path.join(__dirname, '../src/content/disciplines');
const imagesDir = path.join(__dirname, '../public/images/content');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Map of broken URLs to their new Wikimedia File page titles
const fixes = {
  '802_Types_of_Bones.jpg': '601 Bone Classification.jpg',
  '400px-D-glucose_color_coded.png': 'D-glucose color coded.png',
  'Mitochondrion_structure_pt.svg': 'Mitochondrion structure.svg',
  'Coagulative_necrosis_in_kidney_-_low_mag.jpg': 'Coagulative necrosis in kidney tissue.jpg',
  'Cancer_cells_diagram.svg': 'Normal and cancer cells illustration.jpg'
};

async function downloadImages() {
  const dirs = fs.readdirSync(contentDir);
  for (const discSlug of dirs) {
    if (discSlug === 'template') continue;
    const topicsDir = path.join(contentDir, discSlug, 'topics');
    if (!fs.existsSync(topicsDir)) continue;
    
    for (const topSlug of fs.readdirSync(topicsDir)) {
      const topicPath = path.join(topicsDir, topSlug, 'topic.json');
      if (!fs.existsSync(topicPath)) continue;
      
      let topicData = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
      let modified = false;
      
      if (!topicData.modules) continue;
      for (const mod of topicData.modules) {
        if (!mod.lessons) continue;
        for (const lesson of mod.lessons) {
          if (!lesson.content_blocks) continue;
          
          for (const block of lesson.content_blocks) {
            if (block.type === 'scientific_image' && block.src && block.src.includes('upload.wikimedia.org')) {
              let filename = block.src.split('/').pop();
              
              // Apply manual fixes for 404s
              let title = filename;
              for (const [bad, good] of Object.entries(fixes)) {
                if (filename.includes(bad)) {
                  title = good;
                  break;
                }
              }
              
              // Special:FilePath URL
              let cleanTitle = decodeURIComponent(title);
              let dlUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cleanTitle)}`;
              let localName = `${lesson.id || lesson.title.replace(/[^a-zA-Z0-9]/g, '_')}_${cleanTitle.replace(/[^a-zA-Z0-9\.]/g, '_')}`;
              let localPath = path.join(imagesDir, localName);
              
              if (!fs.existsSync(localPath) || fs.statSync(localPath).size === 0) {
                console.log(`Downloading ${title} to ${localName}...`);
                try {
                  const res = await fetch(dlUrl, { 
                    redirect: 'follow',
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                  });
                  if (res.ok) {
                    const buffer = await res.arrayBuffer();
                    fs.writeFileSync(localPath, Buffer.from(buffer));
                    console.log(`Success: ${localName}`);
                    block.src = `/images/content/${localName}`;
                    modified = true;
                  } else {
                    console.error(`Failed to download ${title}: ${res.status}`);
                  }
                } catch (e) {
                  console.error(`Error downloading ${title}: ${e.message}`);
                }
                
                // wait 1000ms to avoid rate limits
                await new Promise(r => setTimeout(r, 1000));
              } else {
                // If it already exists locally, update JSON
                block.src = `/images/content/${localName}`;
                modified = true;
              }
            }
          }
        }
      }
      
      if (modified) {
        fs.writeFileSync(topicPath, JSON.stringify(topicData, null, 2));
        console.log(`Updated ${topicPath}`);
      }
    }
  }
}

downloadImages();
