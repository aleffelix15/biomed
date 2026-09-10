const fs = require('fs');
const path = require('path');

const contentDir = path.resolve(__dirname, '../src/content/disciplines');

function createDiscipline(id, topicId, topicTitle, mods, questions) {
  const dPath = path.join(contentDir, id);
  const tPath = path.join(dPath, 'topics', topicId);
  fs.mkdirSync(tPath, { recursive: true });
  
  // Update topic_count in discipline.json
  const discFile = path.join(dPath, 'discipline.json');
  if (fs.existsSync(discFile)) {
    const dData = JSON.parse(fs.readFileSync(discFile, 'utf8'));
    dData.topics_count = 1;
    fs.writeFileSync(discFile, JSON.stringify(dData, null, 2));
  }
  
  const topic = {
    id: `${id}_${topicId.replace(/-/g, '_')}`, // Internal ID keeps standard format
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
        clinical_application: l.clinical || 'Correlação clínica em desenvolvimento.',
        summary: l.summary || 'Resumo rápido.',
        key_points: JSON.stringify(l.key_points || []),
        order_index: j,
        estimated_minutes: 15
      }))
    }))
  };
  fs.writeFileSync(path.join(tPath, 'topic.json'), JSON.stringify(topic, null, 2));
  
  const qs = questions.map((q, i) => ({
    id: `q_${id}_${i}`,
    discipline_id: id,
    topic_id: topic.id,
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

// 1. HISTOLOGIA -> tecido-epitelial
createDiscipline('histologia', 'tecido-epitelial', 'Tecido Epitelial', [
  {
    title: 'Morfologia e Classificação',
    lessons: [
      { title: 'Características Gerais', content: 'O tecido epitelial é caracterizado pela justaposição de suas células (pouca matriz extracelular) e pela ausência de vasos sanguíneos (avascular). A nutrição ocorre por difusão a partir do tecido conjuntivo subjacente.', clinical: 'No pênfigo, autoanticorpos atacam desmossomos, causando separação das células epiteliais e bolhas cutâneas.', summary: 'Avascular, células unidas e apoiadas na lâmina basal.', key_points: ["Avascular","Junções celulares","Lâmina basal"] },
      { title: 'Epitélios de Revestimento', content: 'Classificam-se quanto ao número de camadas (simples, estratificado, pseudoestratificado) e formato das células superficiais (pavimentoso, cúbico, cilíndrico/colunar).', clinical: 'Metaplasia escamosa no trato respiratório de fumantes: troca de epitélio cilíndrico ciliado por estratificado pavimentoso.', summary: 'Classificação baseada em camadas e formato.', key_points: ["Simples","Estratificado","Pseudoestratificado"] }
    ]
  },
  {
    title: 'Glândulas',
    lessons: [
      { title: 'Epitélios Glandulares', content: 'Formados por células especializadas em secreção. Dividem-se em glândulas exócrinas (mantêm ducto) e endócrinas (perdem conexão, secretam no sangue).', clinical: 'No diabetes tipo 1, ocorre destruição autoimune das células beta (porção endócrina) do pâncreas.', summary: 'Exócrinas (com ducto) vs Endócrinas (sem ducto).', key_points: ["Exócrina","Endócrina","Secreção"] }
    ]
  }
], [
  { question: 'Qual característica NÃO pertence ao tecido epitelial?', a: 'Presença de lâmina basal', b: 'Alta vascularização', c: 'Células justapostas', d: 'Polo apical e basal distintos', e: 'Junções intercelulares abundantes', correct: 'b', exp: 'O tecido epitelial é avascular.' },
  { question: 'O epitélio de revestimento da traqueia é do tipo:', a: 'Simples pavimentoso', b: 'Estratificado cúbico', c: 'Pseudoestratificado cilíndrico ciliado', d: 'Simples cilíndrico', e: 'Estratificado pavimentoso não queratinizado', correct: 'c', exp: 'Também conhecido como epitélio respiratório.' },
  { question: 'Glândulas que liberam sua secreção junto com a parte apical da célula são:', a: 'Merócrinas', b: 'Apócrinas', c: 'Holócrinas', d: 'Endócrinas', e: 'Parácrinas', correct: 'b', exp: 'Como a glândula mamária, perdem parte do citoplasma apical.' },
  { question: 'A estrutura responsável por ancorar as células epiteliais à lâmina basal é:', a: 'Desmossomo', b: 'Junção gap', c: 'Hemidesmossomo', d: 'Zônula de oclusão', e: 'Cílios', correct: 'c', exp: 'Hemidesmossomos conectam a célula à matriz (lâmina basal).' },
  { question: 'O endotélio dos vasos sanguíneos é classificado como epitélio:', a: 'Simples cúbico', b: 'Simples pavimentoso', c: 'Simples cilíndrico', d: 'Estratificado pavimentoso', e: 'Transição', correct: 'b', exp: 'Facilita a troca rápida de substâncias e gases.' },
  { question: 'Qual glândula é classificada como holócrina?', a: 'Sudorípara', b: 'Mamária', c: 'Salivar', d: 'Sebácea', e: 'Tireoide', correct: 'd', exp: 'Nas glândulas sebáceas, a célula inteira é destruída para liberar a secreção.' },
  { question: 'O epitélio de transição (urotélio) é encontrado:', a: 'No esôfago', b: 'Na bexiga urinária', c: 'Nos alvéolos pulmonares', d: 'No intestino delgado', e: 'Na epiderme', correct: 'b', exp: 'O urotélio é adaptado para suportar o estiramento da bexiga.' },
  { question: 'Qual junção celular impede a passagem de macromoléculas entre as células epiteliais adjacentes?', a: 'Desmossomo', b: 'Hemidesmossomo', c: 'Zônula de oclusão', d: 'Junção comunicante', e: 'Zônula de adesão', correct: 'c', exp: 'Forma uma vedação impermeável perto do ápice celular.' },
  { question: 'A queratina no epitélio da pele tem a função primária de:', a: 'Absorção de nutrientes', b: 'Secreção de muco', c: 'Proteção contra dessecação e atrito', d: 'Trocas gasosas', e: 'Produção de suor', correct: 'c', exp: 'Torna o epitélio estratificado pavimentoso resistente e impermeável.' },
  { question: 'As microvilosidades no intestino delgado servem para:', a: 'Locomoção da célula', b: 'Movimentação do muco', c: 'Ancoragem celular', d: 'Aumentar a superfície de absorção', e: 'Secreção de hormônios', correct: 'd', exp: 'Ampliando a área de contato com o lúmen intestinal.' }
]);

// 2. BIOLOGIA MOLECULAR -> dna-estrutura-replicacao
createDiscipline('biologia-molecular', 'dna-estrutura-replicacao', 'DNA: Estrutura e Replicação', [
  {
    title: 'Estrutura dos Ácidos Nucleicos',
    lessons: [
      { title: 'Nucleotídeos e Dupla Hélice', content: 'O DNA é um polímero de nucleotídeos (desoxirribose, grupo fosfato, base nitrogenada). A estrutura de dupla hélice é antiparalela, estabilizada por pontes de hidrogênio (A=T, C≡G).', clinical: 'Agentes intercalantes de DNA, como o brometo de etídio ou doxorrubicina (quimioterápico), inserem-se entre os pares de bases, alterando a estrutura helicoidal.', summary: 'O DNA é uma dupla hélice antiparalela com pareamento específico.', key_points: ["Desoxirribose","Antiparalela","Pontes de Hidrogênio"] },
      { title: 'Organização da Cromatina', content: 'O DNA enrola-se ao redor de histonas (octâmero) formando nucleossomos. A cromatina pode estar ativa (eucromatina) ou condensada (heterocromatina).', clinical: 'A acetilação de histonas é alvo de drogas epigenéticas para reativar genes supressores de tumor.', summary: 'O empacotamento do DNA regula o acesso genético.', key_points: ["Histonas","Eucromatina","Heterocromatina"] }
    ]
  },
  {
    title: 'Replicação e Reparo',
    lessons: [
      { title: 'Processo de Replicação', content: 'A replicação é semiconservativa, iniciada na origem de replicação. A DNA polimerase sintetiza no sentido 5\'→3\'. Fita contínua e fita retardada (fragmentos de Okazaki) são características.', clinical: 'Fármacos análogos de nucleosídeos (ex: aciclovir) inibem a DNA polimerase viral.', summary: 'Semiconservativa, bidirecional, 5\' para 3\'.', key_points: ["DNA Polimerase","Semiconservativa","Fragmentos de Okazaki"] }
    ]
  }
], [
  { question: 'A estrutura primária do DNA consiste em uma sequência de:', a: 'Aminoácidos unidos por ligações peptídicas', b: 'Nucleotídeos unidos por ligações fosfodiéster', c: 'Bases nitrogenadas unidas por pontes de hidrogênio', d: 'Monossacarídeos unidos por ligações glicosídicas', e: 'Histonas', correct: 'b', exp: 'O esqueleto açúcar-fosfato é formado por ligações fosfodiéster covalentemente.' },
  { question: 'No DNA, a complementariedade das bases obedece à regra de Chargaff, onde:', a: 'A=C e G=T', b: 'A=G e C=T', c: 'A=U e C=G', d: 'A=T e C=G', e: 'As purinas pareiam com purinas', correct: 'd', exp: 'Adenina liga-se a Timina (2 pontes) e Citosina a Guanina (3 pontes de hidrogênio).' },
  { question: 'A enzima responsável por separar a dupla hélice durante a replicação é a:', a: 'DNA ligase', b: 'Primase', c: 'Helicase', d: 'DNA polimerase', e: 'Topoisomerase', correct: 'c', exp: 'A Helicase quebra as pontes de hidrogênio abrindo a fita de DNA.' },
  { question: 'O que são os fragmentos de Okazaki?', a: 'Pedaços de RNA no DNA', b: 'Pequenos segmentos de DNA sintetizados na fita atrasada', c: 'Proteínas que estabilizam a fita simples', d: 'Bases anormais reparadas', e: 'Complexos enzima-substrato', correct: 'b', exp: 'Como a polimerase só lê 3\'->5\' (sintetiza 5\'->3\'), a fita antiparalela precisa ser feita em fragmentos.' },
  { question: 'A extremidade 5\' de uma fita de DNA termina em:', a: 'Grupo hidroxila livre', b: 'Base nitrogenada', c: 'Grupo fosfato', d: 'Radical metil', e: 'Um aminoácido', correct: 'c', exp: 'A fita tem direção 5\'-fosfato até 3\'-hidroxila (-OH).' },
  { question: 'As histonas são ricas em quais aminoácidos básicos?', a: 'Glicina e Alanina', b: 'Lisina e Arginina', c: 'Glutamato e Aspartato', d: 'Triptofano e Fenilalanina', e: 'Cisteína e Metionina', correct: 'b', exp: 'Lisina e arginina possuem carga positiva, interagindo com o fosfato negativo do DNA.' },
  { question: 'O que a DNA primase sintetiza?', a: 'A fita líder de DNA', b: 'Um primer (iniciador) de RNA', c: 'Os telômeros', d: 'Fragmentos de Okazaki', e: 'Histonas', correct: 'b', exp: 'A DNA polimerase precisa de uma extremidade 3\'-OH livre, que é fornecida pelo primer de RNA.' },
  { question: 'A eucromatina é caracterizada por ser:', a: 'Altamente condensada e inativa', b: 'Descondensada e transcricionalmente ativa', c: 'Presente apenas em bactérias', d: 'Constituída apenas de RNA', e: 'Composta por DNA sem proteínas', correct: 'b', exp: 'A forma frouxa permite acesso dos fatores de transcrição.' },
  { question: 'A enzima telomerase é uma:', a: 'DNA helicase', b: 'Endonuclease de restrição', c: 'Transcriptase reversa', d: 'RNA polimerase dependente de DNA', e: 'Topoisomerase', correct: 'c', exp: 'Possui molde próprio de RNA para alongar as extremidades dos cromossomos lineares.' },
  { question: 'O alívio da tensão super-helicoidal gerada à frente da forquilha de replicação é feito pela:', a: 'Helicase', b: 'Primase', c: 'DNA ligase', d: 'Topoisomerase', e: 'Proteínas SSB', correct: 'd', exp: 'Topoisomerases (ou girases) clivam temporariamente a fita para desfazer nós torcionais.' }
]);

// 3. GENÉTICA -> heranca-mendeliana
createDiscipline('genetica', 'heranca-mendeliana', 'Herança Mendeliana', [
  {
    title: 'Princípios Básicos',
    lessons: [
      { title: 'Primeira e Segunda Leis de Mendel', content: '1ª Lei: Segregação dos fatores (alelos se separam na gametogênese). 2ª Lei: Segregação independente (genes em cromossomos diferentes segregam de forma independente).', clinical: 'Doenças monogênicas (ex: Fibrose Cística) seguem a 1ª Lei de Mendel.', summary: 'Alelos segregam; genes diferentes combinam aleatoriamente.', key_points: ["1ª Lei","2ª Lei","Alelos"] },
      { title: 'Dominância e Recessividade', content: 'Alelo dominante expressa o fenótipo mesmo em heterozigose. Alelo recessivo necessita de homozigose. Existem também dominância incompleta e codominância.', clinical: 'Na acondroplasia (nanismo), a herança é autossômica dominante.', summary: 'Relações alélicas definem o fenótipo.', key_points: ["Dominante","Recessivo","Codominância"] }
    ]
  },
  {
    title: 'Padrões de Herança',
    lessons: [
      { title: 'Heredogramas', content: 'Representação gráfica das relações de parentesco. Permite identificar se a herança é autossômica (afeta ambos os sexos igualmente) ou ligada ao X.', clinical: 'A hemofilia A é ligada ao cromossomo X recessiva (afeta mais homens).', summary: 'Análise de herança em famílias.', key_points: ["Heredograma","Autossômica","Ligada ao X"] }
    ]
  }
], [
  { question: 'Segundo a Primeira Lei de Mendel, em um indivíduo Aa, os gametas produzidos serão:', a: '100% Aa', b: '50% A e 50% a', c: '100% A', d: '75% A e 25% a', e: 'Nenhuma das anteriores', correct: 'b', exp: 'Os alelos se separam igualmente durante a meiose.' },
  { question: 'O cruzamento entre indivíduos AaBb x AaBb resulta em uma proporção fenotípica (com dominância completa) de:', a: '3:1', b: '1:2:1', c: '9:3:3:1', d: '1:1:1:1', e: '9:7', correct: 'c', exp: 'É a proporção clássica do di-hibridismo mendeliano independente.' },
  { question: 'Quando o fenótipo do heterozigoto é intermediário entre os dois homozigotos, temos um caso de:', a: 'Alelos letais', b: 'Epistasia', c: 'Codominância', d: 'Dominância incompleta', e: 'Pleiotropia', correct: 'd', exp: 'Ex: flores vermelhas e brancas gerando flores rosas.' },
  { question: 'Os grupos sanguíneos do sistema ABO (onde IA e IB se expressam juntos no tipo AB) exemplificam:', a: 'Alelos múltiplos e codominância', b: 'Herança poligênica', c: 'Pleiotropia', d: 'Dominância incompleta', e: 'Ligação gênica', correct: 'a', exp: 'Existem três alelos (IA, IB, i) e IA/IB são codominantes.' },
  { question: 'Em um heredograma, um quadrado pintado (escuro) representa:', a: 'Fêmea afetada', b: 'Macho afetado', c: 'Fêmea normal', d: 'Macho normal', e: 'Gêmeos dizigóticos', correct: 'b', exp: 'Quadrado = Macho; Pintado/Sombreado = Afetado.' },
  { question: 'A hemofilia é uma herança recessiva ligada ao cromossomo X. Um homem hemofílico (XhY) casado com mulher normal homozigota (XHXH) terá:', a: '50% de filhos homens hemofílicos', b: '100% de filhas portadoras', c: '50% de filhas hemofílicas', d: 'Todos os filhos hemofílicos', e: '100% de filhas normais não portadoras', correct: 'b', exp: 'O homem passa o cromossomo Xh (com mutação) para todas as suas filhas, que se tornam XHXh (portadoras).' },
  { question: 'Dois pais normais têm uma criança afetada por uma doença genética. A herança mais provável é:', a: 'Autossômica dominante', b: 'Ligada ao X dominante', c: 'Autossômica recessiva', d: 'Herança mitocondrial', e: 'Ligar ao Y', correct: 'c', exp: 'Pais normais (heterozigotos) que têm filhos afetados caracterizam herança recessiva.' },
  { question: 'Herança holândrica é aquela restrita ao cromossomo:', a: 'X', b: 'Y', c: 'Autossomos', d: 'Mitocondrial', e: 'Cromossomo 21', correct: 'b', exp: 'Ocorre apenas em homens, transmitida de pai para filho via cromossomo Y.' },
  { question: 'A pleiotropia ocorre quando:', a: 'Vários genes determinam uma única característica', b: 'Um único gene tem efeitos em múltiplas características fenotípicas', c: 'O gene letal elimina 25% da prole', d: 'Genes adjacentes segregam juntos', e: 'O ambiente inibe o fenótipo', correct: 'b', exp: 'Exemplo: anemia falciforme causa mudanças nos eritrócitos e múltiplos danos sistêmicos.' },
  { question: 'Na herança mitocondrial humana, a transmissão do DNA mutante se dá:', a: 'Apenas do pai para os filhos', b: 'De ambos os genitores', c: 'Apenas da mãe para toda a sua prole', d: 'Apenas para filhas mulheres', e: 'Apenas para filhos homens', correct: 'c', exp: 'As mitocôndrias do zigoto derivam exclusivamente do óvulo materno.' }
]);

console.log('Disciplinas criadas com sucesso!');
