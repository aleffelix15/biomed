const fs = require('fs');
const path = require('path');

async function validateAndFixURLs() {
  const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
      const filepath = path.join(dir, file);
      if (fs.statSync(filepath).isDirectory()) {
        filelist = walkSync(filepath, filelist);
      } else {
        filelist.push(filepath);
      }
    });
    return filelist;
  };

  const allFiles = walkSync('src/content/disciplines').filter(f => f.endsWith('topic.json'));

  let fixed = 0;

  for (const file of allFiles) {
    let fileChanged = false;
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    
    for (const m of data.modules) {
      for (const l of m.lessons) {
        if (l.content_blocks) {
          for (const block of l.content_blocks) {
            if (block.type === 'scientific_image' && block.src.includes('wikipedia/commons')) {
              // verify it
              try {
                const res = await fetch(block.src, { method: 'HEAD' });
                if (res.status === 404) {
                  console.log(`❌ Broken: ${block.src} in ${l.id}`);
                  // extract filename
                  const urlParts = block.src.split('/');
                  const filename = decodeURIComponent(urlParts[urlParts.length - 1]);
                  
                  const apiRes = await fetch('https://en.wikipedia.org/w/api.php?action=query&titles=File:' + encodeURIComponent(filename) + '&prop=imageinfo&iiprop=url&format=json');
                  const apiData = await apiRes.json();
                  const pages = apiData.query.pages;
                  const page = Object.values(pages)[0];
                  
                  if (page && page.imageinfo && page.imageinfo[0].url) {
                     // remove the utm tracking from url
                     const cleanUrl = page.imageinfo[0].url.split('?')[0];
                     console.log(`   -> Fixed to: ${cleanUrl}`);
                     block.src = cleanUrl;
                     fileChanged = true;
                     fixed++;
                  } else {
                     console.log(`   -> ⚠️ Could not find replacement on wiki for ${filename}.`);
                  }
                } else {
                  console.log(`✅ OK: ${block.src}`);
                }
              } catch (e) {
                console.error(`Error fetching ${block.src}: ${e}`);
              }
            }
          }
        }
      }
    }

    if (fileChanged) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    }
  }

  console.log(`\n🎉 Total URLs fixed: ${fixed}`);
}

validateAndFixURLs();

