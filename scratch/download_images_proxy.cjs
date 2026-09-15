const fs = require('fs');
const path = require('path');
const https = require('https');

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

const publicImgDir = path.join('public', 'images', 'content');
if (!fs.existsSync(publicImgDir)) {
  fs.mkdirSync(publicImgDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(publicImgDir, filename);
    const file = fs.createWriteStream(dest);
    
    // Use wsrv.nl to bypass Wikimedia rate limit block on our server IP
    const encodedUrl = encodeURIComponent(url.replace(/^https?:\/\//, ''));
    const proxyUrl = `https://wsrv.nl/?url=${encodedUrl}`;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };

    https.get(proxyUrl, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filename).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${proxyUrl}' (${response.statusCode})`));
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function migrateImagesToLocal() {
  const allFiles = walkSync('src/content/disciplines').filter(f => f.endsWith('topic.json'));
  let fixed = 0;

  for (const file of allFiles) {
    let fileChanged = false;
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    
    for (const m of data.modules) {
      for (const l of m.lessons) {
        if (l.content_blocks) {
          for (const block of l.content_blocks) {
            if (block.type === 'scientific_image' && block.src.includes('http')) {
              try {
                // Generate safe local filename
                const urlParts = block.src.split('/');
                let rawFilename = decodeURIComponent(urlParts[urlParts.length - 1]);
                rawFilename = rawFilename.split('?')[0];
                const localFilename = `${l.id}_${rawFilename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                
                console.log(`Downloading via Proxy: ${block.src}`);
                await downloadImage(block.src, localFilename);
                console.log(`✅ Saved as ${localFilename}`);
                
                block.src = `/images/content/${localFilename}`;
                fileChanged = true;
                fixed++;
              } catch (e) {
                console.error(`❌ Error downloading ${block.src}: ${e.message}`);
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

  console.log(`\n🎉 Total local images migrated: ${fixed}`);
}

migrateImagesToLocal();

