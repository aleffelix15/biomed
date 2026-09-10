const fs = require('fs');
const path = require('path');

const contentDir = path.resolve(__dirname, '../src/content/disciplines');

function createDiscipline(id, name, icon, category, topicId, topicTitle, mods, questions) {
  const dPath = path.join(contentDir, id);
  fs.mkdirSync(dPath, { recursive: true });
  
  const discipline = {
    id, name, icon, category, topics_count: 1
  };
  fs.writeFileSync(path.join(dPath, 'discipline.json'), JSON.stringify(discipline, null, 2));
  
  const tPath = path.join(dPath, 'topics', topicId);
  fs.mkdirSync(tPath, { recursive: true });
  
  const topic = {
    id: `${id}_${topicId}`,
    discipline_id: id,
    title: topicTitle,
    order_index: 0,
    modules: mods.map((m, i) => ({
      id: `mod_${id}_${i}`,
      title: m.title,
      order_index: i,
      lessons: m.lessons.map((l, j) => ({
        id: `les_${id}_${i}_${j}`,
        module_id: `mod_${id}_${i}`,
        title: l.title,
        content_markdown: l.content,
        order_index: j,
        estimated_minutes: 15
      }))
    }))
  };
  fs.writeFileSync(path.join(tPath, 'topic.json'), JSON.stringify(topic, null, 2));
  
  const qs = questions.map((q, i) => ({
    id: `q_${id}_${i}`,
    discipline_id: id,
    topic_id: `${id}_${topicId}`,
    question: q.question,
    option_a: q.a,
    option_b: q.b,
    option_c: q.c,
    option_d: q.d,
    option_e: q.e,
    correct_option: q.correct,
    explanation: q.exp,
    difficulty: q.diff || 'medium'
  }));
  fs.writeFileSync(path.join(tPath, 'questions.json'), JSON.stringify(qs, null, 2));
}

// 1. ANATOMIA
createDiscipline('anatomia', 'Anatomia', 'Bone', 'Ciências Básicas', 'sistema_esqueletico', 'Sistema Esquelético', [
  {
    title: 'Fundamentos',
    lessons: [
      { title: 'Introdução ao Sistema Esquelético', content: 'O sistema esquelético é composto por ossos, cartilagens e articulações. Ele fornece suporte estrutural, proteção de órgãos internos, alavancagem para o movimento, armazenamento de minerais e hematopoiese (produção de células sanguíneas na medula óssea vermelha).' },
      { title: 'Tipos de Ossos', content: 'Os ossos são classificados em longos (ex: fêmur), curtos (ex: carpos), planos (ex: escápula), irregulares (ex: vértebras) e sesamoides (ex: patela).' },
      { title: 'Histologia Óssea', content: 'O tecido ósseo é conjuntivo denso, contendo osteoblastos (síntese), osteócitos (manutenção) e osteoclastos (reabsorção). A matriz extracelular é rica em cálcio e fósforo (hidroxiapatita).' }
    ]
  },
  {
    title: 'Esqueleto Axial',
    lessons: [
      { title: 'Crânio e Face', content: 'Composto por 22 ossos, divididos em neurocrânio (protege o encéfalo) e viscerocrânio (ossos da face).' },
      { title: 'Coluna Vertebral e Tórax', content: 'A coluna vertebral possui 33 vértebras (7 cervicais, 12 torácicas, 5 lombares, 5 sacrais e 4 coccígeas). O tórax é formado pelo esterno e 12 pares de costelas.' }
    ]
  }
], [
  { question: 'Qual das alternativas descreve corretamente a função dos osteoclastos?', a: 'Síntese de matriz óssea.', b: 'Manutenção do tecido ósseo.', c: 'Reabsorção e degradação da matriz óssea.', d: 'Produção de cartilagem.', e: 'Armazenamento de cálcio.', correct: 'c', exp: 'Osteoclastos são células multinucleadas derivadas de monócitos que reabsorvem o tecido ósseo.' },
  { question: 'O fêmur é classificado como um osso:', a: 'Curto', b: 'Plano', c: 'Longo', d: 'Irregular', e: 'Sesamoide', correct: 'c', exp: 'O fêmur é um osso longo, possuindo diáfise e epífises.' },
  { question: 'Quantas vértebras compõem a região cervical da coluna vertebral humana?', a: '5', b: '7', c: '12', d: '33', e: '4', correct: 'b', exp: 'A coluna cervical possui 7 vértebras (C1 a C7).' },
  { question: 'Qual osso não faz parte do neurocrânio?', a: 'Frontal', b: 'Occipital', c: 'Parietal', d: 'Mandíbula', e: 'Esfenoide', correct: 'd', exp: 'A mandíbula faz parte do viscerocrânio (ossos da face).' },
  { question: 'Qual estrutura é responsável pela hematopoiese no adulto?', a: 'Medula óssea amarela', b: 'Periósteo', c: 'Osteon', d: 'Medula óssea vermelha', e: 'Cartilagem articular', correct: 'd', exp: 'A medula óssea vermelha é o tecido hematopoiético ativo.' },
  { question: 'A patela é o maior exemplo de osso:', a: 'Longo', b: 'Irregular', c: 'Sesamoide', d: 'Plano', e: 'Pneumático', correct: 'c', exp: 'A patela se desenvolve dentro do tendão do músculo quadríceps, sendo um osso sesamoide.' },
  { question: 'O osso esterno articula-se diretamente com:', a: 'As vértebras lombares', b: 'A clavícula e cartilagens costais verdadeiras', c: 'A escápula', d: 'O úmero', e: 'O osso ilíaco', correct: 'b', exp: 'O esterno articula-se com a clavícula e com as cartilagens das costelas verdadeiras (1 a 7).' },
  { question: 'As suturas cranianas são exemplos de articulações:', a: 'Sinoviais', b: 'Fibrosas', c: 'Cartilaginosas', d: 'Móveis', e: 'Anfiartroses', correct: 'b', exp: 'As suturas são articulações fibrosas imóveis (sinartroses).' },
  { question: 'Qual componente é responsável pela dureza do osso?', a: 'Colágeno tipo I', b: 'Hidroxiapatita', c: 'Elastina', d: 'Ácido hialurônico', e: 'Fibronectina', correct: 'b', exp: 'Os cristais de hidroxiapatita (fosfato de cálcio) conferem rigidez e dureza ao osso.' },
  { question: 'A epífise de um osso longo de uma criança contém principalmente cartilagem:', a: 'Elástica', b: 'Hialina', c: 'Fibrocartilagem', d: 'Fibrosa', e: 'Reticular', correct: 'b', exp: 'O disco epifisário (placa de crescimento) é formado por cartilagem hialina.' }
]);

// 2. FISIOLOGIA
createDiscipline('fisiologia', 'Fisiologia', 'HeartPulse', 'Ciências Básicas', 'cardiovascular', 'Sistema Cardiovascular', [
  {
    title: 'Eletrofisiologia',
    lessons: [
      { title: 'Potencial de Ação Cardíaco', content: 'O potencial de ação em células contráteis possui 5 fases (0 a 4). A fase de despolarização rápida é mediada por canais de Na+ rápidos, seguida de um platô (fase 2) mediado pela entrada de Ca++.' },
      { title: 'Sistema de Condução', content: 'O nó sinoatrial (SA) é o marcapasso natural. O impulso viaja para o nó atrioventricular (AV), feixe de His, e fibras de Purkinje, permitindo a contração sincronizada.' }
    ]
  },
  {
    title: 'Mecânica e Ciclo Cardíaco',
    lessons: [
      { title: 'Ciclo Cardíaco', content: 'Compreende sístole (contração e ejeção) e diástole (relaxamento e enchimento). O débito cardíaco é o volume de sangue ejetado por minuto (Volume Sistólico x Frequência Cardíaca).' },
      { title: 'Regulação da Pressão Arterial', content: 'Regulada a curto prazo por barorreceptores (reflexo barorreceptor) e a longo prazo pelo sistema renina-angiotensina-aldosterona (SRAA).' }
    ]
  }
], [
  { question: 'Qual íon é primariamente responsável pela fase de platô (fase 2) no potencial de ação de miócitos ventriculares?', a: 'Sódio (Na+)', b: 'Potássio (K+)', c: 'Cálcio (Ca2+)', d: 'Cloreto (Cl-)', e: 'Magnésio (Mg2+)', correct: 'c', exp: 'A entrada de Ca2+ pelos canais tipo L contrabalança a saída de K+, criando o platô.' },
  { question: 'Onde se localiza o marcapasso natural do coração?', a: 'Nó Atrioventricular', b: 'Fibras de Purkinje', c: 'Nó Sinoatrial', d: 'Feixe de His', e: 'Válvula Mitral', correct: 'c', exp: 'O Nó Sinoatrial (SA), localizado no átrio direito, dita o ritmo cardíaco basal.' },
  { question: 'A primeira bulha cardíaca (B1) é causada por:', a: 'Fechamento das valvas semilunares', b: 'Abertura das valvas atrioventriculares', c: 'Fechamento das valvas atrioventriculares', d: 'Enchimento rápido dos ventrículos', e: 'Abertura da valva aórtica', correct: 'c', exp: 'B1 corresponde ao som de fechamento das valvas atrioventriculares (mitral e tricúspide).' },
  { question: 'O que define a pré-carga cardíaca?', a: 'A resistência vascular periférica', b: 'A pressão na aorta', c: 'O grau de estiramento miocárdico no final da diástole', d: 'O volume residual sistólico', e: 'A força de contração atrial', correct: 'c', exp: 'A pré-carga é o volume de sangue no ventrículo no final da diástole, que estira as fibras musculares.' },
  { question: 'Qual enzima converte a Angiotensina I em Angiotensina II?', a: 'Renina', b: 'Aldosterona', c: 'ECA (Enzima Conversora de Angiotensina)', d: 'Vasopressina', e: 'Trombina', correct: 'c', exp: 'A ECA, predominantemente nos pulmões, realiza essa conversão essencial no SRAA.' },
  { question: 'Qual a principal função do Reflexo Barorreceptor?', a: 'Controle de longo prazo do volume sanguíneo', b: 'Manutenção da glicemia', c: 'Ajuste rápido da pressão arterial via sistema nervoso autônomo', d: 'Secreção de aldosterona', e: 'Regulação da temperatura corpórea', correct: 'c', exp: 'Os barorreceptores carotídeos e aórticos detectam mudanças agudas e ativam respostas autonômicas.' },
  { question: 'No ECG, a onda P representa:', a: 'Despolarização ventricular', b: 'Repolarização ventricular', c: 'Despolarização atrial', d: 'Repolarização atrial', e: 'Tempo de condução AV', correct: 'c', exp: 'A onda P marca a despolarização dos átrios que precede a sístole atrial.' },
  { question: 'Qual dos seguintes fatores AUMENTA o débito cardíaco?', a: 'Estimulação parassimpática', b: 'Aumento da pós-carga', c: 'Bradicardia grave', d: 'Estimulação simpática', e: 'Hipovolemia', correct: 'd', exp: 'O simpático aumenta a frequência e a força de contração, elevando o débito cardíaco.' },
  { question: 'A fração de ejeção do ventrículo esquerdo normal é de aproximadamente:', a: '20-30%', b: '40-45%', c: '55-70%', d: '80-95%', e: '100%', correct: 'c', exp: 'Uma FEVE normal fica entre 55% e 70%.' },
  { question: 'O que é inotropismo?', a: 'Frequência cardíaca', b: 'Velocidade de condução AV', c: 'Força de contração miocárdica', d: 'Grau de relaxamento ventricular', e: 'Tônus vascular', correct: 'c', exp: 'Agentes inotrópicos afetam a força de contração (contratilidade) do músculo cardíaco.' }
]);

// 3. FARMACOLOGIA
createDiscipline('farmacologia', 'Farmacologia', 'Pill', 'Ciências Biomédicas', 'farmacocinetica', 'Farmacocinética', [
  {
    title: 'Absorção e Distribuição',
    lessons: [
      { title: 'Vias de Administração', content: 'As vias enterais (oral, sublingual) e parenterais (IV, IM, SC) afetam a velocidade e extensão da absorção. A via IV tem 100% de biodisponibilidade.' },
      { title: 'Biodisponibilidade e Absorção', content: 'É a fração do fármaco inalterado que atinge a circulação sistêmica. Fármacos lipofílicos cruzam membranas por difusão passiva mais facilmente.' },
      { title: 'Distribuição e Ligação Proteica', content: 'Fármacos se ligam à albumina no plasma. Apenas a fração livre é farmacologicamente ativa e capaz de cruzar barreiras tissulares.' }
    ]
  },
  {
    title: 'Metabolismo e Excreção',
    lessons: [
      { title: 'Biotransformação Hepática', content: 'Fase I (oxidação, redução, hidrólise - Citocromo P450) e Fase II (conjugação com ácido glicurônico) tornam os fármacos mais polares para excreção.' },
      { title: 'Excreção Renal e Meia-vida', content: 'A filtração glomerular e secreção tubular eliminam fármacos. A meia-vida (T1/2) é o tempo necessário para a concentração plasmática cair pela metade.' }
    ]
  }
], [
  { question: 'A biodisponibilidade de um fármaco administrado por via intravenosa é considerada:', a: '0%', b: '50%', c: '100%', d: 'Depende do metabolismo de primeira passagem', e: 'Variável com a dieta', correct: 'c', exp: 'Por ser injetado diretamente na corrente sanguínea, 100% da dose atinge o sangue sistêmico.' },
  { question: 'Qual sistema enzimático é o mais importante para o metabolismo de Fase I dos fármacos no fígado?', a: 'Monoamina oxidase (MAO)', b: 'Citocromo P450 (CYP)', c: 'UDP-glicuronosiltransferase', d: 'Catecol-O-metiltransferase (COMT)', e: 'Acetilcolinesterase', correct: 'b', exp: 'As enzimas da família CYP450 são responsáveis pela maioria das reações oxidativas de Fase I.' },
  { question: 'O que caracteriza o Efeito de Primeira Passagem?', a: 'Excreção rápida pelos rins', b: 'Biotransformação do fármaco no fígado antes de atingir a circulação sistêmica', c: 'Absorção diretamente para o SNC', d: 'Ligação imediata a proteínas plasmáticas', e: 'Ausência de absorção intestinal', correct: 'b', exp: 'Fármacos orais passam pelo sistema porta-hepático, onde podem ser extensamente metabolizados antes de chegarem à circulação geral.' },
  { question: 'Qual das reações abaixo é característica da Fase II do metabolismo de fármacos?', a: 'Oxidação', b: 'Redução', c: 'Glicuronidação', d: 'Hidrólise', e: 'Desaminação', correct: 'c', exp: 'A Fase II envolve reações de conjugação, como a glicuronidação, que aumentam a hidrossolubilidade.' },
  { question: 'Em relação à ligação às proteínas plasmáticas, é correto afirmar:', a: 'A fração ligada do fármaco é a que exerce a ação terapêutica.', b: 'Apenas a fração livre (não ligada) atravessa membranas e interage com receptores.', c: 'A ligação à albumina é irreversível.', d: 'Fármacos altamente ligados têm meia-vida muito curta.', e: 'A ligação proteica não sofre competição entre múltiplos fármacos.', correct: 'b', exp: 'Apenas o fármaco na sua forma livre está disponível para exercer efeitos e ser eliminado.' },
  { question: 'O conceito de Clearance (Depuração) refere-se a:', a: 'Tempo para a concentração do fármaco cair pela metade', b: 'Volume aparente de distribuição do fármaco', c: 'Volume de plasma purificado (livre) do fármaco por unidade de tempo', d: 'Dose máxima tolerada antes da toxicidade', e: 'Fração do fármaco que chega à urina intacta', correct: 'c', exp: 'Clearance é uma medida da eficiência de eliminação do organismo, expressa em volume por tempo (ex: mL/min).' },
  { question: 'A maioria dos fármacos ácidos fracos é melhor absorvida em qual ambiente?', a: 'Estômago (pH ácido)', b: 'Intestino delgado distal (pH alcalino)', c: 'Cólon (pH neutro)', d: 'No sangue (pH 7.4)', e: 'Na saliva', correct: 'a', exp: 'Em ambiente ácido, o ácido fraco fica na sua forma não-ionizada (lipossolúvel), facilitando a absorção gástrica.' },
  { question: 'O estado de equilíbrio estável (steady state) de um fármaco, com doses múltiplas, é atingido em aproximadamente:', a: '1 a 2 meias-vidas', b: '4 a 5 meias-vidas', c: '10 meias-vidas', d: 'Sempre em 24 horas', e: 'Depende apenas da dose de ataque', correct: 'b', exp: 'A regra geral é que o steady state é alcançado após 4 a 5 meias-vidas de eliminação do fármaco.' },
  { question: 'Qual via de administração evita completamente o efeito de primeira passagem hepático?', a: 'Oral', b: 'Retal superior', c: 'Sublingual', d: 'Via sonda nasogástrica', e: 'Deglutição', correct: 'c', exp: 'A via sublingual drena diretamente para a veia cava superior via veias da face e pescoço, bypassando o fígado.' },
  { question: 'Uma meia-vida longa de um fármaco implica que:', a: 'Ele deve ser administrado várias vezes ao dia.', b: 'Sua absorção é muito rápida.', c: 'Demorará mais para atingir o estado de equilíbrio estável sem dose de ataque.', d: 'Sua toxicidade é mínima.', e: 'Sua ligação proteica é zero.', correct: 'c', exp: 'Como o steady state requer 4 a 5 meias-vidas, uma meia-vida longa atrasa a chegada ao platô de concentração se não for dada dose de ataque.' }
]);

console.log('3 disciplinas geradas com sucesso!');
