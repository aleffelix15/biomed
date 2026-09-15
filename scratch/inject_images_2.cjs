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
  // EMBRIOLOGIA
  "les_emb_1_3": {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Acrosome_reaction_diagram_en.svg",
    alt: "Fases da fertilização",
    caption: "Fases da fertilização e reação acrossômica, culminando na fusão dos pró-núcleos masculino e feminino.",
    credit: "Mariana Ruiz (LadyofHats), Domínio Público",
    type_img: "diagram"
  },
  "les_emb_2_2": {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Blastocyst_English.svg",
    alt: "Estrutura do Blastocisto",
    caption: "Estrutura do blastocisto no momento da implantação (nidação), destacando o trofoblasto e o embrioblasto (massa celular interna).",
    credit: "Seans Potato Business, CC BY-SA 3.0",
    type_img: "diagram"
  },

  // HEMATOLOGIA
  "les_hem_1_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/15/1903_Shape_of_Red_Blood_Cells.jpg",
    alt: "Morfologia das Hemácias",
    caption: "A morfologia normal da hemácia (disco bicôncavo) maximiza a área de superfície para otimizar as trocas gasosas.",
    credit: "OpenStax College, CC BY 3.0",
    type_img: "diagram"
  },
  "les_hem_2_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/8/87/Iron_deficiency_anemia_blood_film.jpg",
    alt: "Anemia Ferropriva no Esfregaço",
    caption: "Esfregaço sanguíneo em Anemia Ferropriva, revelando anisocitose, poiquilocitose, microcitose e severa hipocromia (aumento da palidez central).",
    credit: "FizFaZ, CC BY-SA 4.0",
    type_img: "microscopy"
  },
  "les_hem_3_2": {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Sickle_cell_01.jpg",
    alt: "Drepanócitos",
    caption: "Drepanócitos (hemácias em foice) típicos de anemia falciforme, um tipo de anemia hemolítica hereditária.",
    credit: "CDC/Dr. Graham Beards, Domínio Público",
    type_img: "microscopy"
  },

  // PATOLOGIA
  "les_pat_1_2": {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Coagulative_necrosis_in_kidney_-_low_mag.jpg",
    alt: "Necrose de Coagulação",
    caption: "Necrose de coagulação em tecido renal. Note a preservação inicial do arcabouço tecidual, embora as células estejam mortas e anucleadas.",
    credit: "Nephron, CC BY-SA 3.0",
    type_img: "microscopy"
  },
  "les_pat_3_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/8/87/Cancer_cells_diagram.svg",
    alt: "Progressão Tumoral",
    caption: "A progressão tumoral envolve hiperplasia, displasia e, finalmente, invasão tecidual (câncer maligno).",
    credit: "NIH National Cancer Institute, Domínio Público",
    type_img: "diagram"
  },

  // MICROBIOLOGIA
  "les_mic_2_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/52/Bacterial_morphology_diagram_pt.svg",
    alt: "Morfologia Bacteriana",
    caption: "Principais morfologias bacterianas: cocos (isolados, diplococos, estreptococos, estafilococos), bacilos e bactérias espiraladas (espirilos, espiroquetas).",
    credit: "Mariana Ruiz, Domínio Público",
    type_img: "diagram"
  },
  "les_mic_2_2": {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/91/Gram-Cell-wall.svg",
    alt: "Parede Celular Gram-Positiva vs Gram-Negativa",
    caption: "Bases da Coloração de Gram: bactérias Gram-positivas possuem espessa camada de peptideoglicano (retém cristal violeta); Gram-negativas têm fina camada entre duas membranas.",
    credit: "Julian Inmaculada, CC BY-SA 4.0",
    type_img: "diagram"
  },

  // PARASITOLOGIA
  "les_par_1_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Giardia_lamblia_SEM_8698_lores.jpg",
    alt: "Giardia lamblia",
    caption: "Micrografia eletrônica de varredura mostrando trofozoítos de Giardia lamblia, agente etiológico da giardíase.",
    credit: "CDC / Janice Carr, Domínio Público",
    type_img: "microscopy"
  },
  "les_par_2_1": {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/30/Ascaris_lumbricoides.jpg",
    alt: "Ascaris lumbricoides",
    caption: "Vermes adultos de Ascaris lumbricoides (lombriga). O parasitismo intenso pode causar obstrução intestinal.",
    credit: "CDC, Domínio Público",
    type_img: "photo"
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

