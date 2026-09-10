import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, '../src/content/data');

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// 1. Disciplines
const disciplines = [
  { id: 'anatomia', name: 'Anatomia', icon: 'Bone', category: 'Ciências Básicas', topics_count: 0 },
  { id: 'fisiologia', name: 'Fisiologia', icon: 'HeartPulse', category: 'Ciências Básicas', topics_count: 0 },
  { id: 'histologia', name: 'Histologia', icon: 'Layers', category: 'Ciências Básicas', topics_count: 0 },
  { id: 'bioquimica', name: 'Bioquímica', icon: 'FlaskConical', category: 'Ciências Básicas', topics_count: 1 },
  { id: 'biologia-molecular', name: 'Biologia Molecular', icon: 'Dna', category: 'Ciências Básicas', topics_count: 0 },
  { id: 'genetica', name: 'Genética', icon: 'Dna', category: 'Ciências Básicas', topics_count: 0 },
  { id: 'microbiologia', name: 'Microbiologia', icon: 'Bug', category: 'Ciências Biomédicas', topics_count: 0 },
  { id: 'imunologia', name: 'Imunologia', icon: 'ShieldCheck', category: 'Ciências Biomédicas', topics_count: 0 },
  { id: 'parasitologia', name: 'Parasitologia', icon: 'Bug', category: 'Ciências Biomédicas', topics_count: 0 },
  { id: 'patologia', name: 'Patologia', icon: 'Microscope', category: 'Ciências Biomédicas', topics_count: 0 },
  { id: 'hematologia', name: 'Hematologia', icon: 'Droplet', category: 'Ciências Biomédicas', topics_count: 0 },
  { id: 'farmacologia', name: 'Farmacologia', icon: 'Pill', category: 'Ciências Biomédicas', topics_count: 0 },
  { id: 'citologia', name: 'Citologia', icon: 'Layers', category: 'Ciências Básicas', topics_count: 0 },
  { id: 'embriologia', name: 'Embriologia', icon: 'Egg', category: 'Ciências Básicas', topics_count: 0 },
  { id: 'epidemiologia', name: 'Epidemiologia', icon: 'Activity', category: 'Saúde Coletiva', topics_count: 0 },
  { id: 'analises-clinicas', name: 'Análises Clínicas', icon: 'TestTube', category: 'Prática Laboratorial', topics_count: 0 },
  { id: 'toxicologia', name: 'Toxicologia', icon: 'Beaker', category: 'Ciências Biomédicas', topics_count: 0 },
  { id: 'biomedicina-estetica', name: 'Biomedicina Estética', icon: 'Sparkles', category: 'Prática Laboratorial', topics_count: 0 },
  { id: 'imagenologia', name: 'Imagenologia', icon: 'ScanLine', category: 'Prática Laboratorial', topics_count: 0 },
  { id: 'biosseguranca', name: 'Biossegurança', icon: 'Biohazard', category: 'Prática Laboratorial', topics_count: 0 },
];
fs.writeFileSync(path.join(contentDir, 'disciplines.json'), JSON.stringify(disciplines, null, 2));

// 2. Topics
const topics = [
  { id: 'bioquimica_glicose', discipline_id: 'bioquimica', title: 'Glicose e Metabolismo', status: 'active', has_content: true, order_index: 0 }
];
fs.writeFileSync(path.join(contentDir, 'topics.json'), JSON.stringify(topics, null, 2));

// 3. Modules
const modules = [
  { id: 'mod_glicose_1', topic_id: 'bioquimica_glicose', title: 'Fundamentos e Estrutura', order_index: 0 },
  { id: 'mod_glicose_2', topic_id: 'bioquimica_glicose', title: 'Regulação Hormonal', order_index: 1 },
  { id: 'mod_glicose_3', topic_id: 'bioquimica_glicose', title: 'Vias Metabólicas', order_index: 2 },
  { id: 'mod_glicose_4', topic_id: 'bioquimica_glicose', title: 'Clínica e Laboratório', order_index: 3 }
];
fs.writeFileSync(path.join(contentDir, 'modules.json'), JSON.stringify(modules, null, 2));

// 4. Lessons
const lessons = [
  { id: 'les_g1_1', module_id: 'mod_glicose_1', title: 'Fundamentos', objective: 'Introdução à Glicose', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'A glicose é um carboidrato simples...', clinical_application: 'Essencial cerebral', summary: 'Glicose é energia.', key_points: '["Energia", "Carboidrato"]', order_index: 0 },
  { id: 'les_g1_2', module_id: 'mod_glicose_1', title: 'Estrutura', objective: 'Estrutura Química', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'É uma aldohexose, fórmula C6H12O6...', clinical_application: 'Mutarotação', summary: 'Aldohexose de 6 carbonos.', key_points: '["Aldohexose", "Pirano"]', order_index: 1 },
  { id: 'les_g1_3', module_id: 'mod_glicose_1', title: 'Função', objective: 'Funções Biológicas', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Principal combustível celular e precursor estrutural.', clinical_application: 'Hipoglicemia', summary: 'Combustível celular.', key_points: '["Metabolismo", "ATP"]', order_index: 2 },
  { id: 'les_g1_4', module_id: 'mod_glicose_1', title: 'Digestão e absorção', objective: 'Como digerimos', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Amilase salivar e pancreática quebram amido até glicose.', clinical_application: 'Deficiência de lactase (exemplo similar)', summary: 'Amilase -> maltose -> glicose.', key_points: '["Amilase", "Borda em escova"]', order_index: 3 },
  { id: 'les_g1_5', module_id: 'mod_glicose_1', title: 'Transporte', objective: 'Transporte SGLT', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Transporte ativo secundário no intestino via SGLT1.', clinical_application: 'Terapia de Reidratação Oral', summary: 'Absorção via SGLT1 acoplado ao Na+.', key_points: '["SGLT1", "Transporte Ativo"]', order_index: 4 },
  { id: 'les_g1_6', module_id: 'mod_glicose_1', title: 'GLUTs', objective: 'Transportadores GLUT', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Transportadores facilitadores. GLUT4 é dependente de insulina (músculo/adiposo).', clinical_application: 'Resistência à insulina', summary: 'GLUTs facilitam a entrada nas células.', key_points: '["GLUT1", "GLUT2", "GLUT4"]', order_index: 5 },
  
  { id: 'les_g2_1', module_id: 'mod_glicose_2', title: 'Insulina', objective: 'Ação da Insulina', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Hormônio anabólico secretado pelas células beta do pâncreas.', clinical_application: 'Diabetes Tipo 1', summary: 'Reduz a glicemia.', key_points: '["Célula Beta", "Anabólico"]', order_index: 0 },
  { id: 'les_g2_2', module_id: 'mod_glicose_2', title: 'Glucagon', objective: 'Ação do Glucagon', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Hormônio catabólico das células alfa, estimula liberação de glicose.', clinical_application: 'Hipoglicemia de jejum', summary: 'Aumenta a glicemia.', key_points: '["Célula Alfa", "Glicogenólise"]', order_index: 1 },
  { id: 'les_g2_3', module_id: 'mod_glicose_2', title: 'Regulação glicêmica', objective: 'Homeostase', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Equilíbrio fino entre insulina e hormônios contrarreguladores.', clinical_application: 'Cetoacidose', summary: 'Manutenção da glicemia normal.', key_points: '["Homeostase", "Eixo hormonal"]', order_index: 2 },
  
  { id: 'les_g3_1', module_id: 'mod_glicose_3', title: 'Glicólise', objective: 'Via glicolítica', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Oxidação da glicose a piruvato gerando 2 ATPs e 2 NADH.', clinical_application: 'Efeito Warburg (câncer)', summary: 'Glicose -> 2 Piruvato.', key_points: '["Citosol", "Fosfofrutoquinase"]', order_index: 0 },
  { id: 'les_g3_2', module_id: 'mod_glicose_3', title: 'Glicogênese', objective: 'Síntese de glicogênio', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Armazenamento da glicose no fígado e músculo sob estímulo da insulina.', clinical_application: 'Glicogenoses', summary: 'Glicose -> Glicogênio.', key_points: '["Glicogênio sintase", "Armazenamento"]', order_index: 1 },
  { id: 'les_g3_3', module_id: 'mod_glicose_3', title: 'Glicogenólise', objective: 'Quebra do glicogênio', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Liberação de glicose-1-P a partir do glicogênio no jejum.', clinical_application: 'Doença de Von Gierke', summary: 'Glicogênio -> Glicose.', key_points: '["Glicogênio fosforilase", "Glucagon"]', order_index: 2 },
  { id: 'les_g3_4', module_id: 'mod_glicose_3', title: 'Gliconeogênese', objective: 'Nova glicose', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Síntese de glicose a partir de precursores não-glicídicos (lactato, aminoácidos).', clinical_application: 'Hipoglicemia alcoólica', summary: 'Lactato/AA -> Glicose.', key_points: '["Fígado", "Jejum prolongado"]', order_index: 3 },
  { id: 'les_g3_5', module_id: 'mod_glicose_3', title: 'Integração metabólica', objective: 'Ciclo Jejum-Alimentação', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Como os órgãos cooperam para manter a energia.', clinical_application: 'Sindrome metabólica', summary: 'Fígado doa, músculo consome.', key_points: '["Ciclo de Cori", "Adipócito"]', order_index: 4 },
  
  { id: 'les_g4_1', module_id: 'mod_glicose_4', title: 'Diabetes mellitus', objective: 'Patologia', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Síndrome metabólica caracterizada por hiperglicemia crônica.', clinical_application: 'Pé diabético', summary: 'Falta ou resistência à insulina.', key_points: '["Hiperglicemia", "Complicações microvasculares"]', order_index: 0 },
  { id: 'les_g4_2', module_id: 'mod_glicose_4', title: 'Exames laboratoriais', objective: 'Diagnóstico', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Glicemia de jejum, TOTG e Hemoglobina Glicada (HbA1c).', clinical_application: 'Diagnóstico laboratorial', summary: 'Avaliação laboratorial.', key_points: '["HbA1c", "Glicemia de Jejum"]', order_index: 1 },
  { id: 'les_g4_3', module_id: 'mod_glicose_4', title: 'Aplicações clínicas', objective: 'Manejo', difficulty: 'Médio', estimated_minutes: 15, content_markdown: 'Uso de hipoglicemiantes orais, insulina e monitoramento contínuo.', clinical_application: 'Bomba de insulina', summary: 'Tratamento do DM.', key_points: '["Metformina", "Insulinoterapia"]', order_index: 2 }
];
fs.writeFileSync(path.join(contentDir, 'lessons.json'), JSON.stringify(lessons, null, 2));

// 5. Questions
const questions = [
  { id: 'q_g1', discipline_id: 'bioquimica', topic_id: 'bioquimica_glicose', question: 'Qual transportador de glicose é dependente de insulina?', option_a: 'GLUT1', option_b: 'GLUT2', option_c: 'GLUT3', option_d: 'GLUT4', option_e: 'SGLT1', correct_option: 'd', explanation: 'O GLUT4, presente em músculos e tecido adiposo, é translocado para a membrana pela insulina.', difficulty: 'hard' },
  { id: 'q_g2', discipline_id: 'bioquimica', topic_id: 'bioquimica_glicose', question: 'A glicólise ocorre em qual compartimento celular?', option_a: 'Mitocôndria', option_b: 'Citosol', option_c: 'Núcleo', option_d: 'Retículo endoplasmático', option_e: 'Complexo de Golgi', correct_option: 'b', explanation: 'Todas as enzimas da via glicolítica estão no citosol.', difficulty: 'hard' },
  { id: 'q_g3', discipline_id: 'bioquimica', topic_id: 'bioquimica_glicose', question: 'Qual é a enzima chave regulatória da glicólise?', option_a: 'Hexoquinase', option_b: 'Piruvato quinase', option_c: 'Fosfofrutoquinase-1 (PFK-1)', option_d: 'Glicogênio sintase', option_e: 'Aldolase', correct_option: 'c', explanation: 'A PFK-1 é o principal ponto de controle alostérico da via.', difficulty: 'hard' },
  { id: 'q_g4', discipline_id: 'bioquimica', topic_id: 'bioquimica_glicose', question: 'Qual hormônio estimula a glicogenólise hepática?', option_a: 'Insulina', option_b: 'Somatostatina', option_c: 'Glucagon', option_d: 'Aldosterona', option_e: 'Testosterona', correct_option: 'c', explanation: 'O glucagon avisa o fígado que a glicemia está baixa, estimulando a quebra do glicogênio.', difficulty: 'hard' },
  { id: 'q_g5', discipline_id: 'bioquimica', topic_id: 'bioquimica_glicose', question: 'O Ciclo de Cori envolve a troca de quais metabólitos entre músculo e fígado?', option_a: 'Glicose e Alanina', option_b: 'Lactato e Glicose', option_c: 'Glicerol e Ácidos Graxos', option_d: 'Piruvato e Ureia', option_e: 'Glicogênio e Glicose', correct_option: 'b', explanation: 'O músculo gera lactato na glicólise anaeróbia, que vai ao fígado ser convertido de volta em glicose.', difficulty: 'hard' },
  { id: 'q_g6', discipline_id: 'bioquimica', topic_id: 'bioquimica_glicose', question: 'Qual exame reflete a média da glicemia dos últimos 2 a 3 meses?', option_a: 'Glicemia capilar', option_b: 'Glicose na urina', option_c: 'Hemoglobina Glicada (HbA1c)', option_d: 'Teste de Tolerância Oral à Glicose', option_e: 'Peptídeo C', correct_option: 'c', explanation: 'A HbA1c reflete a glicação não-enzimática da hemoglobina durante a vida útil das hemácias (120 dias).', difficulty: 'hard' },
  { id: 'q_g7', discipline_id: 'bioquimica', topic_id: 'bioquimica_glicose', question: 'Na gliconeogênese, o fígado NÃO pode usar qual substância como precursor?', option_a: 'Lactato', option_b: 'Glicerol', option_c: 'Alanina', option_d: 'Acetil-CoA', option_e: 'Piruvato', correct_option: 'd', explanation: 'Em animais, o Acetil-CoA não pode ser convertido de volta a piruvato para fazer glicose.', difficulty: 'hard' },
  { id: 'q_g8', discipline_id: 'bioquimica', topic_id: 'bioquimica_glicose', question: 'O mecanismo de ação de hipoglicemiantes orais como a Metformina envolve principalmente:', option_a: 'Aumentar secreção de insulina', option_b: 'Inibir a gliconeogênese hepática', option_c: 'Inibir a alfa-glicosidase intestinal', option_d: 'Estimular eliminação renal de glicose', option_e: 'Destruir o glucagon', correct_option: 'b', explanation: 'A Metformina age sobretudo reduzindo a produção hepática de glicose (gliconeogênese).', difficulty: 'hard' },
  { id: 'q_g9', discipline_id: 'bioquimica', topic_id: 'bioquimica_glicose', question: 'Qual é o tipo de ligação que forma as ramificações no glicogênio?', option_a: 'Alfa-1,4', option_b: 'Alfa-1,6', option_c: 'Beta-1,4', option_d: 'Beta-1,6', option_e: 'Peptídica', correct_option: 'b', explanation: 'A cadeia principal é alfa-1,4, mas os pontos de ramificação são formados por ligações alfa-1,6.', difficulty: 'hard' },
  { id: 'q_g10', discipline_id: 'bioquimica', topic_id: 'bioquimica_glicose', question: 'A absorção de glicose no lúmen intestinal contra o gradiente de concentração ocorre via:', option_a: 'Difusão simples', option_b: 'GLUT2', option_c: 'GLUT4', option_d: 'SGLT1', option_e: 'SGLT2', correct_option: 'd', explanation: 'O SGLT1 faz transporte ativo secundário aproveitando o gradiente do Na+.', difficulty: 'hard' }
];
fs.writeFileSync(path.join(contentDir, 'questions.json'), JSON.stringify(questions, null, 2));

console.log('Arquivos locais gerados com sucesso!');
