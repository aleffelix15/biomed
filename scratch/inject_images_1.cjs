const fs = require('fs');
const path = require('path');

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

const injections = {
  // ANATOMIA
  "les_anatomia_0_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e9/802_Types_of_Bones.jpg",
    alt: "Tipos morfológicos de ossos",
    caption: "Principais classificações morfológicas dos ossos: longos, curtos, planos, irregulares e sesamoides.",
    credit: "OpenStax Anatomy and Physiology, CC BY 4.0",
    type_img: "diagram"
  },
  "les_anatomia_1_0": {
    src: "https://upload.wikimedia.org/wikipedia/commons/8/89/704_Skull-01.jpg",
    alt: "Vista lateral do crânio humano",
    caption: "Anatomia do crânio humano em vista lateral, destacando as suturas e os principais ossos do neurocrânio e viscerocrânio.",
    credit: "OpenStax College, CC BY 3.0",
    type_img: "diagram"
  },
  "les_ac1_2": {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e5/2011_Heart_Anatomy.jpg",
    alt: "Anatomia interna do coração",
    caption: "Anatomia interna do coração humano, evidenciando átrios, ventrículos e septo interventricular.",
    credit: "OpenStax College, CC BY 3.0",
    type_img: "diagram"
  },
  "les_ac3_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4e/2103_Structure_of_Blood_Vessels.jpg",
    alt: "Estrutura dos vasos sanguíneos",
    caption: "Diferenciação estrutural das artérias e veias, com destaque para as túnicas íntima, média (mais espessa em artérias) e adventícia.",
    credit: "OpenStax College, CC BY 3.0",
    type_img: "diagram"
  },
  
  // HISTOLOGIA
  "les_histologia_0_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Epithelial_Tissues_Stratified_Squamous_Epithelium_%2840230842160%29.jpg",
    alt: "Epitélio estratificado pavimentoso",
    caption: "Micrografia de epitélio estratificado pavimentoso (mucosa esofágica). Note as múltiplas camadas que conferem proteção contra atrito.",
    credit: "Berkshire Community College Bioscience Image Library, Domínio Público",
    type_img: "microscopy"
  },
  "les_histologia_1_0": {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/52/405_Modes_of_Secretion_by_Glands.jpg",
    alt: "Modos de secreção glandular",
    caption: "Modos de secreção glandular: merócrina, apócrina e holócrina. A manutenção ou perda do ducto define glândulas exócrinas e endócrinas.",
    credit: "OpenStax College, CC BY 3.0",
    type_img: "diagram"
  },

  // CITOLOGIA
  "les_cit_1_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/da/Cell_membrane_detailed_diagram_pt.svg",
    alt: "Mosaico fluido da membrana plasmática",
    caption: "O modelo do mosaico fluido: dupla camada fosfolipídica intercalada por proteínas integrais, periféricas e colesterol.",
    credit: "Mariana Ruiz (LadyofHats), Domínio Público",
    type_img: "diagram"
  },
  "les_cit_3_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Mitochondrion_structure_pt.svg",
    alt: "Ultraestrutura mitocondrial",
    caption: "Ultraestrutura da mitocôndria, evidenciando as membranas externa e interna, as cristas mitocondriais e a matriz onde ocorre o ciclo de Krebs.",
    credit: "Kelvinsong (traduzido), Domínio Público",
    type_img: "diagram"
  }
};

const allFiles = walkSync('src/content/disciplines').filter(f => f.endsWith('topic.json'));

let modifications = 0;

for (const file of allFiles) {
  let fileChanged = false;
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  
  data.modules.forEach(m => {
    m.lessons.forEach(l => {
      if (injections[l.id]) {
        if (!l.content_blocks) {
          // Converte pra content_blocks e injeta a imagem no meio/final
          l.content_blocks = [
            { type: "markdown", value: l.content_markdown || l.content || "" },
            { 
              type: "scientific_image", 
              src: injections[l.id].src, 
              alt: injections[l.id].alt, 
              caption: injections[l.id].caption, 
              credit: injections[l.id].credit, 
              zoomable: true, 
              type_img: injections[l.id].type_img 
            }
          ];
          // Removemos o content_markdown antigo pra forçar o ContentRenderer a usar os blocos
          delete l.content_markdown;
          delete l.content;
          
          fileChanged = true;
          modifications++;
          console.log(`✅ Injetado em: ${l.id} (${l.title})`);
        }
      }
    });
  });

  if (fileChanged) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  }
}

console.log(`\n🎉 Total de lições modificadas: ${modifications}`);

