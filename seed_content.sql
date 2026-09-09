-- Seed data for flashcards and questions

-- D1 (Anatomia Humana)
INSERT INTO public.flashcards (id, discipline_id, topic_id, question, answer, category) VALUES
(gen_random_uuid(), 'd1', 't1', 'Quais são as três principais partes do osso longo?', 'Diáfise, epífise e metáfise.', 'Anatomia'),
(gen_random_uuid(), 'd1', 't1', 'Qual é a principal função da medula óssea vermelha?', 'Hematopoiese (produção de células do sangue).', 'Fisiologia'),
(gen_random_uuid(), 'd1', 't2', 'O que compõe o Sistema Nervoso Central?', 'O encéfalo e a medula espinhal.', 'Anatomia'),
(gen_random_uuid(), 'd1', 't2', 'Quais são os lobos do cérebro humano?', 'Frontal, Parietal, Temporal e Occipital.', 'Anatomia');

INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty) VALUES
(gen_random_uuid(), 'd1', 't1', 'Qual osso não faz parte do esqueleto axial?', 'Crânio', 'Vértebras', 'Costelas', 'Esterno', 'Fêmur', 'e', 'O fêmur faz parte do esqueleto apendicular (membros inferiores), enquanto o crânio, vértebras, costelas e esterno formam o eixo central do corpo (esqueleto axial).', 'medium'),
(gen_random_uuid(), 'd1', 't2', 'A substância branca do sistema nervoso central é composta principalmente por:', 'Corpos celulares', 'Axônios mielinizados', 'Dendritos', 'Células da glia', 'Sinapses', 'b', 'A substância branca recebe esse nome devido à alta concentração de mielina (lipídeo de cor branca) que envolve os axônios das células nervosas.', 'medium');

-- D2 (Bioquímica)
INSERT INTO public.flashcards (id, discipline_id, topic_id, question, answer, category) VALUES
(gen_random_uuid(), 'd2', 't4', 'O que é a glicólise?', 'A quebra de uma molécula de glicose em duas moléculas de piruvato, gerando ATP e NADH.', 'Metabolismo'),
(gen_random_uuid(), 'd2', 't5', 'Qual é a principal função do ciclo de Krebs?', 'Oxidar o acetil-CoA para extrair energia na forma de elétrons de alta energia (NADH e FADH2).', 'Metabolismo'),
(gen_random_uuid(), 'd2', 't6', 'O que são enzimas?', 'São catalisadores biológicos, geralmente proteínas, que aceleram as reações químicas no organismo.', 'Enzimas');

INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty) VALUES
(gen_random_uuid(), 'd2', 't4', 'Qual é o saldo líquido de ATP na glicólise por molécula de glicose?', '1 ATP', '2 ATPs', '4 ATPs', '36 ATPs', '38 ATPs', 'b', 'Embora 4 ATPs sejam produzidos, 2 são consumidos na fase de investimento, resultando num saldo líquido de 2 ATPs.', 'hard'),
(gen_random_uuid(), 'd2', 't6', 'Qual dos fatores abaixo NÃO altera a atividade enzimática?', 'Temperatura', 'pH', 'Concentração de substrato', 'Radiação ultravioleta (a longo prazo)', 'Massa molar do produto', 'e', 'As enzimas são sensíveis a temperatura e pH. A concentração de substrato altera a velocidade até a saturação. A massa molar do produto final não interfere diretamente na capacidade catalítica da enzima.', 'medium');

-- D5 (Microbiologia Clínica)
INSERT INTO public.flashcards (id, discipline_id, topic_id, question, answer, category) VALUES
(gen_random_uuid(), 'd5', null, 'Qual a diferença na coloração de Gram entre bactérias Gram-positivas e Gram-negativas?', 'Gram-positivas coram-se de roxo/azul devido à espessa camada de peptideoglicano, Gram-negativas coram-se de rosa/vermelho devido à fina camada.', 'Bacteriologia'),
(gen_random_uuid(), 'd5', null, 'O que é um meio de cultura seletivo?', 'É um meio que contém substâncias que inibem o crescimento de certos microrganismos e favorecem outros.', 'Técnicas Laboratoriais');

INSERT INTO public.questions (id, discipline_id, topic_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty) VALUES
(gen_random_uuid(), 'd5', null, 'O meio de cultura Ágar MacConkey é classificado como:', 'Apenas diferencial', 'Apenas seletivo', 'Seletivo e diferencial', 'Enriquecido', 'Meio de transporte', 'c', 'O Ágar MacConkey é seletivo para Gram-negativas (sais biliares inibem Gram-positivas) e diferencial para fermentadores de lactose (ficam rosa).', 'hard');
