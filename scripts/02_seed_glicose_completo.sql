-- SEED GERADO PELO MOTOR DE AUDITORIA ANTIGRAVITY
INSERT INTO public.topics (id, discipline_id, title, status, has_content) VALUES ('bioquimica_glicose', 'bioquimica', 'Glicose e Metabolismo', 'active', true) ON CONFLICT (id) DO UPDATE SET has_content = true;

DELETE FROM public.modules WHERE topic_id = 'bioquimica_glicose';
DELETE FROM public.questions WHERE topic_id = 'bioquimica_glicose';

DO $$
DECLARE
  mod_0 uuid;
  mod_1 uuid;
  mod_2 uuid;
  mod_3 uuid;
BEGIN
  INSERT INTO public.modules (topic_id, title, order_index) VALUES ('bioquimica_glicose', 'Fundamentos e Estrutura', 0) RETURNING id INTO mod_0;
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_0, 'Fundamentos', 'Introdução à Glicose', 'Médio', 15, 'A glicose é um carboidrato simples...', 'Essencial cerebral', 'Glicose é energia.', '["Energia", "Carboidrato"]', 0);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_0, 'Estrutura', 'Estrutura Química', 'Médio', 15, 'É uma aldohexose, fórmula C6H12O6...', 'Mutarotação', 'Aldohexose de 6 carbonos.', '["Aldohexose", "Pirano"]', 1);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_0, 'Função', 'Funções Biológicas', 'Médio', 15, 'Principal combustível celular e precursor estrutural.', 'Hipoglicemia', 'Combustível celular.', '["Metabolismo", "ATP"]', 2);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_0, 'Digestão e absorção', 'Como digerimos', 'Médio', 15, 'Amilase salivar e pancreática quebram amido até glicose.', 'Deficiência de lactase (exemplo similar)', 'Amilase -> maltose -> glicose.', '["Amilase", "Borda em escova"]', 3);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_0, 'Transporte', 'Transporte SGLT', 'Médio', 15, 'Transporte ativo secundário no intestino via SGLT1.', 'Terapia de Reidratação Oral', 'Absorção via SGLT1 acoplado ao Na+.', '["SGLT1", "Transporte Ativo"]', 4);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_0, 'GLUTs', 'Transportadores GLUT', 'Médio', 15, 'Transportadores facilitadores. GLUT4 é dependente de insulina (músculo/adiposo).', 'Resistência à insulina', 'GLUTs facilitam a entrada nas células.', '["GLUT1", "GLUT2", "GLUT4"]', 5);
  INSERT INTO public.modules (topic_id, title, order_index) VALUES ('bioquimica_glicose', 'Regulação Hormonal', 1) RETURNING id INTO mod_1;
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_1, 'Insulina', 'Ação da Insulina', 'Médio', 15, 'Hormônio anabólico secretado pelas células beta do pâncreas.', 'Diabetes Tipo 1', 'Reduz a glicemia.', '["Célula Beta", "Anabólico"]', 0);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_1, 'Glucagon', 'Ação do Glucagon', 'Médio', 15, 'Hormônio catabólico das células alfa, estimula liberação de glicose.', 'Hipoglicemia de jejum', 'Aumenta a glicemia.', '["Célula Alfa", "Glicogenólise"]', 1);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_1, 'Regulação glicêmica', 'Homeostase', 'Médio', 15, 'Equilíbrio fino entre insulina e hormônios contrarreguladores.', 'Cetoacidose', 'Manutenção da glicemia normal.', '["Homeostase", "Eixo hormonal"]', 2);
  INSERT INTO public.modules (topic_id, title, order_index) VALUES ('bioquimica_glicose', 'Vias Metabólicas', 2) RETURNING id INTO mod_2;
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_2, 'Glicólise', 'Via glicolítica', 'Médio', 15, 'Oxidação da glicose a piruvato gerando 2 ATPs e 2 NADH.', 'Efeito Warburg (câncer)', 'Glicose -> 2 Piruvato.', '["Citosol", "Fosfofrutoquinase"]', 0);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_2, 'Glicogênese', 'Síntese de glicogênio', 'Médio', 15, 'Armazenamento da glicose no fígado e músculo sob estímulo da insulina.', 'Glicogenoses', 'Glicose -> Glicogênio.', '["Glicogênio sintase", "Armazenamento"]', 1);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_2, 'Glicogenólise', 'Quebra do glicogênio', 'Médio', 15, 'Liberação de glicose-1-P a partir do glicogênio no jejum.', 'Doença de Von Gierke', 'Glicogênio -> Glicose.', '["Glicogênio fosforilase", "Glucagon"]', 2);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_2, 'Gliconeogênese', 'Nova glicose', 'Médio', 15, 'Síntese de glicose a partir de precursores não-glicídicos (lactato, aminoácidos).', 'Hipoglicemia alcoólica', 'Lactato/AA -> Glicose.', '["Fígado", "Jejum prolongado"]', 3);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_2, 'Integração metabólica', 'Ciclo Jejum-Alimentação', 'Médio', 15, 'Como os órgãos cooperam para manter a energia.', 'Sindrome metabólica', 'Fígado doa, músculo consome.', '["Ciclo de Cori", "Adipócito"]', 4);
  INSERT INTO public.modules (topic_id, title, order_index) VALUES ('bioquimica_glicose', 'Clínica e Laboratório', 3) RETURNING id INTO mod_3;
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_3, 'Diabetes mellitus', 'Patologia', 'Médio', 15, 'Síndrome metabólica caracterizada por hiperglicemia crônica.', 'Pé diabético', 'Falta ou resistência à insulina.', '["Hiperglicemia", "Complicações microvasculares"]', 0);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_3, 'Exames laboratoriais', 'Diagnóstico', 'Médio', 15, 'Glicemia de jejum, TOTG e Hemoglobina Glicada (HbA1c).', 'Diagnóstico laboratorial', 'Avaliação laboratorial.', '["HbA1c", "Glicemia de Jejum"]', 1);
  INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index)
  VALUES (mod_3, 'Aplicações clínicas', 'Manejo', 'Médio', 15, 'Uso de hipoglicemiantes orais, insulina e monitoramento contínuo.', 'Bomba de insulina', 'Tratamento do DM.', '["Metformina", "Insulinoterapia"]', 2);
END $$;

INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
VALUES (gen_random_uuid(), 'bioquimica', 'bioquimica_glicose', 'Qual transportador de glicose é dependente de insulina?', 'GLUT1', 'GLUT2', 'GLUT3', 'GLUT4', 'SGLT1', 'd', 'O GLUT4, presente em músculos e tecido adiposo, é translocado para a membrana pela insulina.', 'hard');
INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
VALUES (gen_random_uuid(), 'bioquimica', 'bioquimica_glicose', 'A glicólise ocorre em qual compartimento celular?', 'Mitocôndria', 'Citosol', 'Núcleo', 'Retículo endoplasmático', 'Complexo de Golgi', 'b', 'Todas as enzimas da via glicolítica estão no citosol.', 'hard');
INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
VALUES (gen_random_uuid(), 'bioquimica', 'bioquimica_glicose', 'Qual é a enzima chave regulatória da glicólise?', 'Hexoquinase', 'Piruvato quinase', 'Fosfofrutoquinase-1 (PFK-1)', 'Glicogênio sintase', 'Aldolase', 'c', 'A PFK-1 é o principal ponto de controle alostérico da via.', 'hard');
INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
VALUES (gen_random_uuid(), 'bioquimica', 'bioquimica_glicose', 'Qual hormônio estimula a glicogenólise hepática?', 'Insulina', 'Somatostatina', 'Glucagon', 'Aldosterona', 'Testosterona', 'c', 'O glucagon avisa o fígado que a glicemia está baixa, estimulando a quebra do glicogênio.', 'hard');
INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
VALUES (gen_random_uuid(), 'bioquimica', 'bioquimica_glicose', 'O Ciclo de Cori envolve a troca de quais metabólitos entre músculo e fígado?', 'Glicose e Alanina', 'Lactato e Glicose', 'Glicerol e Ácidos Graxos', 'Piruvato e Ureia', 'Glicogênio e Glicose', 'b', 'O músculo gera lactato na glicólise anaeróbia, que vai ao fígado ser convertido de volta em glicose.', 'hard');
INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
VALUES (gen_random_uuid(), 'bioquimica', 'bioquimica_glicose', 'Qual exame reflete a média da glicemia dos últimos 2 a 3 meses?', 'Glicemia capilar', 'Glicose na urina', 'Hemoglobina Glicada (HbA1c)', 'Teste de Tolerância Oral à Glicose', 'Peptídeo C', 'c', 'A HbA1c reflete a glicação não-enzimática da hemoglobina durante a vida útil das hemácias (120 dias).', 'hard');
INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
VALUES (gen_random_uuid(), 'bioquimica', 'bioquimica_glicose', 'Na gliconeogênese, o fígado NÃO pode usar qual substância como precursor?', 'Lactato', 'Glicerol', 'Alanina', 'Acetil-CoA', 'Piruvato', 'd', 'Em animais, o Acetil-CoA não pode ser convertido de volta a piruvato para fazer glicose.', 'hard');
INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
VALUES (gen_random_uuid(), 'bioquimica', 'bioquimica_glicose', 'O mecanismo de ação de hipoglicemiantes orais como a Metformina envolve principalmente:', 'Aumentar secreção de insulina', 'Inibir a gliconeogênese hepática', 'Inibir a alfa-glicosidase intestinal', 'Estimular eliminação renal de glicose', 'Destruir o glucagon', 'b', 'A Metformina age sobretudo reduzindo a produção hepática de glicose (gliconeogênese).', 'hard');
INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
VALUES (gen_random_uuid(), 'bioquimica', 'bioquimica_glicose', 'Qual é o tipo de ligação que forma as ramificações no glicogênio?', 'Alfa-1,4', 'Alfa-1,6', 'Beta-1,4', 'Beta-1,6', 'Peptídica', 'b', 'A cadeia principal é alfa-1,4, mas os pontos de ramificação são formados por ligações alfa-1,6.', 'hard');
INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
VALUES (gen_random_uuid(), 'bioquimica', 'bioquimica_glicose', 'A absorção de glicose no lúmen intestinal contra o gradiente de concentração ocorre via:', 'Difusão simples', 'GLUT2', 'GLUT4', 'SGLT1', 'SGLT2', 'd', 'O SGLT1 faz transporte ativo secundário aproveitando o gradiente do Na+.', 'hard');
