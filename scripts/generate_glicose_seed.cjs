const fs = require('fs');

const topicId = 'bioquimica_glicose';

const modules = [
  {
    title: 'Fundamentos e Estrutura',
    lessons: [
      { title: 'Fundamentos', obj: 'Introdução à Glicose', content: 'A glicose é um carboidrato simples...', summary: 'Glicose é energia.', keys: '["Energia", "Carboidrato"]', clin: 'Essencial cerebral' },
      { title: 'Estrutura', obj: 'Estrutura Química', content: 'É uma aldohexose, fórmula C6H12O6...', summary: 'Aldohexose de 6 carbonos.', keys: '["Aldohexose", "Pirano"]', clin: 'Mutarotação' },
      { title: 'Função', obj: 'Funções Biológicas', content: 'Principal combustível celular e precursor estrutural.', summary: 'Combustível celular.', keys: '["Metabolismo", "ATP"]', clin: 'Hipoglicemia' },
      { title: 'Digestão e absorção', obj: 'Como digerimos', content: 'Amilase salivar e pancreática quebram amido até glicose.', summary: 'Amilase -> maltose -> glicose.', keys: '["Amilase", "Borda em escova"]', clin: 'Deficiência de lactase (exemplo similar)' },
      { title: 'Transporte', obj: 'Transporte SGLT', content: 'Transporte ativo secundário no intestino via SGLT1.', summary: 'Absorção via SGLT1 acoplado ao Na+.', keys: '["SGLT1", "Transporte Ativo"]', clin: 'Terapia de Reidratação Oral' },
      { title: 'GLUTs', obj: 'Transportadores GLUT', content: 'Transportadores facilitadores. GLUT4 é dependente de insulina (músculo/adiposo).', summary: 'GLUTs facilitam a entrada nas células.', keys: '["GLUT1", "GLUT2", "GLUT4"]', clin: 'Resistência à insulina' }
    ]
  },
  {
    title: 'Regulação Hormonal',
    lessons: [
      { title: 'Insulina', obj: 'Ação da Insulina', content: 'Hormônio anabólico secretado pelas células beta do pâncreas.', summary: 'Reduz a glicemia.', keys: '["Célula Beta", "Anabólico"]', clin: 'Diabetes Tipo 1' },
      { title: 'Glucagon', obj: 'Ação do Glucagon', content: 'Hormônio catabólico das células alfa, estimula liberação de glicose.', summary: 'Aumenta a glicemia.', keys: '["Célula Alfa", "Glicogenólise"]', clin: 'Hipoglicemia de jejum' },
      { title: 'Regulação glicêmica', obj: 'Homeostase', content: 'Equilíbrio fino entre insulina e hormônios contrarreguladores.', summary: 'Manutenção da glicemia normal.', keys: '["Homeostase", "Eixo hormonal"]', clin: 'Cetoacidose' }
    ]
  },
  {
    title: 'Vias Metabólicas',
    lessons: [
      { title: 'Glicólise', obj: 'Via glicolítica', content: 'Oxidação da glicose a piruvato gerando 2 ATPs e 2 NADH.', summary: 'Glicose -> 2 Piruvato.', keys: '["Citosol", "Fosfofrutoquinase"]', clin: 'Efeito Warburg (câncer)' },
      { title: 'Glicogênese', obj: 'Síntese de glicogênio', content: 'Armazenamento da glicose no fígado e músculo sob estímulo da insulina.', summary: 'Glicose -> Glicogênio.', keys: '["Glicogênio sintase", "Armazenamento"]', clin: 'Glicogenoses' },
      { title: 'Glicogenólise', obj: 'Quebra do glicogênio', content: 'Liberação de glicose-1-P a partir do glicogênio no jejum.', summary: 'Glicogênio -> Glicose.', keys: '["Glicogênio fosforilase", "Glucagon"]', clin: 'Doença de Von Gierke' },
      { title: 'Gliconeogênese', obj: 'Nova glicose', content: 'Síntese de glicose a partir de precursores não-glicídicos (lactato, aminoácidos).', summary: 'Lactato/AA -> Glicose.', keys: '["Fígado", "Jejum prolongado"]', clin: 'Hipoglicemia alcoólica' },
      { title: 'Integração metabólica', obj: 'Ciclo Jejum-Alimentação', content: 'Como os órgãos cooperam para manter a energia.', summary: 'Fígado doa, músculo consome.', keys: '["Ciclo de Cori", "Adipócito"]', clin: 'Sindrome metabólica' }
    ]
  },
  {
    title: 'Clínica e Laboratório',
    lessons: [
      { title: 'Diabetes mellitus', obj: 'Patologia', content: 'Síndrome metabólica caracterizada por hiperglicemia crônica.', summary: 'Falta ou resistência à insulina.', keys: '["Hiperglicemia", "Complicações microvasculares"]', clin: 'Pé diabético' },
      { title: 'Exames laboratoriais', obj: 'Diagnóstico', content: 'Glicemia de jejum, TOTG e Hemoglobina Glicada (HbA1c).', summary: 'Avaliação laboratorial.', keys: '["HbA1c", "Glicemia de Jejum"]', clin: 'Diagnóstico laboratorial' },
      { title: 'Aplicações clínicas', obj: 'Manejo', content: 'Uso de hipoglicemiantes orais, insulina e monitoramento contínuo.', summary: 'Tratamento do DM.', keys: '["Metformina", "Insulinoterapia"]', clin: 'Bomba de insulina' }
    ]
  }
];

const questions = [
  { q: 'Qual transportador de glicose é dependente de insulina?', a: 'GLUT1', b: 'GLUT2', c: 'GLUT3', d: 'GLUT4', e: 'SGLT1', correct: 'd', exp: 'O GLUT4, presente em músculos e tecido adiposo, é translocado para a membrana pela insulina.' },
  { q: 'A glicólise ocorre em qual compartimento celular?', a: 'Mitocôndria', b: 'Citosol', c: 'Núcleo', d: 'Retículo endoplasmático', e: 'Complexo de Golgi', correct: 'b', exp: 'Todas as enzimas da via glicolítica estão no citosol.' },
  { q: 'Qual é a enzima chave regulatória da glicólise?', a: 'Hexoquinase', b: 'Piruvato quinase', c: 'Fosfofrutoquinase-1 (PFK-1)', d: 'Glicogênio sintase', e: 'Aldolase', correct: 'c', exp: 'A PFK-1 é o principal ponto de controle alostérico da via.' },
  { q: 'Qual hormônio estimula a glicogenólise hepática?', a: 'Insulina', b: 'Somatostatina', c: 'Glucagon', d: 'Aldosterona', e: 'Testosterona', correct: 'c', exp: 'O glucagon avisa o fígado que a glicemia está baixa, estimulando a quebra do glicogênio.' },
  { q: 'O Ciclo de Cori envolve a troca de quais metabólitos entre músculo e fígado?', a: 'Glicose e Alanina', b: 'Lactato e Glicose', c: 'Glicerol e Ácidos Graxos', d: 'Piruvato e Ureia', e: 'Glicogênio e Glicose', correct: 'b', exp: 'O músculo gera lactato na glicólise anaeróbia, que vai ao fígado ser convertido de volta em glicose.' },
  { q: 'Qual exame reflete a média da glicemia dos últimos 2 a 3 meses?', a: 'Glicemia capilar', b: 'Glicose na urina', c: 'Hemoglobina Glicada (HbA1c)', d: 'Teste de Tolerância Oral à Glicose', e: 'Peptídeo C', correct: 'c', exp: 'A HbA1c reflete a glicação não-enzimática da hemoglobina durante a vida útil das hemácias (120 dias).' },
  { q: 'Na gliconeogênese, o fígado NÃO pode usar qual substância como precursor?', a: 'Lactato', b: 'Glicerol', c: 'Alanina', d: 'Acetil-CoA', e: 'Piruvato', correct: 'd', exp: 'Em animais, o Acetil-CoA não pode ser convertido de volta a piruvato para fazer glicose.' },
  { q: 'O mecanismo de ação de hipoglicemiantes orais como a Metformina envolve principalmente:', a: 'Aumentar secreção de insulina', b: 'Inibir a gliconeogênese hepática', c: 'Inibir a alfa-glicosidase intestinal', d: 'Estimular eliminação renal de glicose', e: 'Destruir o glucagon', correct: 'b', exp: 'A Metformina age sobretudo reduzindo a produção hepática de glicose (gliconeogênese).' },
  { q: 'Qual é o tipo de ligação que forma as ramificações no glicogênio?', a: 'Alfa-1,4', b: 'Alfa-1,6', c: 'Beta-1,4', d: 'Beta-1,6', e: 'Peptídica', correct: 'b', exp: 'A cadeia principal é alfa-1,4, mas os pontos de ramificação são formados por ligações alfa-1,6.' },
  { q: 'A absorção de glicose no lúmen intestinal contra o gradiente de concentração ocorre via:', a: 'Difusão simples', b: 'GLUT2', c: 'GLUT4', d: 'SGLT1', e: 'SGLT2', correct: 'd', exp: 'O SGLT1 faz transporte ativo secundário aproveitando o gradiente do Na+.' }
];

let sql = `-- SEED GERADO PELO MOTOR DE AUDITORIA ANTIGRAVITY\n`;
sql += `INSERT INTO public.topics (id, discipline_id, title, status, has_content) VALUES ('${topicId}', 'bioquimica', 'Glicose e Metabolismo', 'active', true) ON CONFLICT (id) DO UPDATE SET has_content = true;\n\n`;

sql += `DELETE FROM public.modules WHERE topic_id = '${topicId}';\n`;
sql += `DELETE FROM public.questions WHERE topic_id = '${topicId}';\n\n`;

sql += `DO $$\nDECLARE\n`;
for(let m=0; m<modules.length; m++) sql += `  mod_${m} uuid;\n`;
sql += `BEGIN\n`;

for(let m=0; m<modules.length; m++) {
  const mod = modules[m];
  sql += `  INSERT INTO public.modules (topic_id, title, order_index) VALUES ('${topicId}', '${mod.title}', ${m}) RETURNING id INTO mod_${m};\n`;
  for(let l=0; l<mod.lessons.length; l++) {
    const les = mod.lessons[l];
    sql += `  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)\n`;
    sql += `  VALUES (mod_${m}, '${les.title}', '${les.obj}', 'Médio', 15, '${les.content}', '${les.clin}', '${les.summary}', '${les.keys}', ${l});\n`;
  }
}

sql += `END $$;\n\n`;

// Simulado
for(let q=0; q<questions.length; q++) {
  const ques = questions[q];
  sql += `INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)\n`;
  sql += `VALUES (gen_random_uuid(), 'bioquimica', '${topicId}', '${ques.q.replace(/'/g, "''")}', '${ques.a.replace(/'/g, "''")}', '${ques.b.replace(/'/g, "''")}', '${ques.c.replace(/'/g, "''")}', '${ques.d.replace(/'/g, "''")}', '${ques.e.replace(/'/g, "''")}', '${ques.correct}', '${ques.exp.replace(/'/g, "''")}', 'hard');\n`;
}

fs.writeFileSync('scripts/02_seed_glicose_completo.sql', sql);
console.log("SQL Gerado.");
