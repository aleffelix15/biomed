-- Seed data for Glicose content engine (Assunto: Glicose)
-- This file populates the specific complete vertical slice requested for Glicose

-- 1. Ensure the discipline Bioquímica and topic Glicose exist
INSERT INTO public.disciplines (id, name, icon, category, topics_count) 
VALUES ('d2', 'Bioquímica', 'Microscope', 'Geral', 6)
ON CONFLICT (id) DO UPDATE SET topics_count = 6;

INSERT INTO public.topics (id, discipline_id, title, status, has_content)
VALUES ('t_glicose', 'd2', 'Glicose', 'active', true)
ON CONFLICT (id) DO UPDATE SET has_content = true;

-- 2. Create Modules
-- Delete existing modules for this topic to avoid duplication when re-running
DELETE FROM public.modules WHERE topic_id = 't_glicose';

DO $$
DECLARE
    mod_fundamentos uuid;
    mod_metabolismo uuid;
    mod_regulacao uuid;
    mod_clinica uuid;
    les_1 uuid;
    les_2 uuid;
BEGIN
    -- Módulo 1: Fundamentos
    INSERT INTO public.modules (topic_id, title, order_index) VALUES ('t_glicose', 'Fundamentos', 1) RETURNING id INTO mod_fundamentos;
    
    -- Módulo 2: Metabolismo e Vias
    INSERT INTO public.modules (topic_id, title, order_index) VALUES ('t_glicose', 'Metabolismo e Vias', 2) RETURNING id INTO mod_metabolismo;
    
    -- Módulo 3: Regulação
    INSERT INTO public.modules (topic_id, title, order_index) VALUES ('t_glicose', 'Regulação', 3) RETURNING id INTO mod_regulacao;
    
    -- Módulo 4: Aplicação Clínica
    INSERT INTO public.modules (topic_id, title, order_index) VALUES ('t_glicose', 'Aplicação Clínica', 4) RETURNING id INTO mod_clinica;

    -- 3. Create Lessons
    -- Aula 1: O que é glicose
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index) 
    VALUES (
        mod_fundamentos, 
        '1. O que é glicose?', 
        'Compreender o conceito básico de glicose e sua importância biológica.', 
        'Iniciante', 
        10, 
        'A glicose é um carboidrato simples, mais especificamente um monossacarídeo, e atua como a principal fonte de energia para a maioria das células do corpo humano. \n\nNo sistema nervoso central, os neurônios dependem quase exclusivamente da glicose como combustível em condições fisiológicas normais.',
        'A hipoglicemia severa pode levar a danos cerebrais irreversíveis devido à dependência neural pela glicose.',
        'A glicose é a moeda energética universal primária da célula.',
        '["Monossacarídeo", "Principal fonte de energia", "Combustível neural"]',
        1
    ) RETURNING id INTO les_1;

    -- Aula 2: Estrutura química da glicose
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, content_markdown, clinical_application, summary, key_points, order_index) 
    VALUES (
        mod_fundamentos, 
        '2. Estrutura química da glicose', 
        'Conhecer a fórmula molecular e a conformação estrutural da molécula de glicose.', 
        'Intermediário', 
        10, 
        'A glicose possui a fórmula molecular C6H12O6. É classificada como uma aldo-hexose, pois contém seis átomos de carbono e um grupo aldeído em sua estrutura aberta.\n\nNa solução aquosa, a glicose existe principalmente na forma cíclica (anel piranósico), que é a conformação mais estável termodinamicamente.',
        'A determinação laboratorial da glicose frequentemente explora propriedades químicas específicas do seu grupo aldeído (capacidade redutora).',
        'Hexose e aldose. Fórmula C6H12O6. Majoritariamente em forma cíclica no organismo.',
        '["C6H12O6", "Aldohexose", "Anel piranósico"]',
        2
    ) RETURNING id INTO les_2;

    -- Aula 3 a 6 (Exemplos simplificados para preencher o plano)
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_fundamentos, '3. Funções da glicose no organismo', 'Entender o papel além da energia', 'Iniciante', 15, 3);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_fundamentos, '4. Digestão e absorção', 'Como a glicose chega ao sangue', 'Intermediário', 15, 4);
    
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_metabolismo, '5. Transporte da glicose', 'Mecanismos de entrada celular', 'Intermediário', 15, 5);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_metabolismo, '6. GLUTs', 'Tipos e funções dos transportadores', 'Avançado', 20, 6);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_metabolismo, '10. Glicólise', 'A quebra da glicose', 'Avançado', 20, 7);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_metabolismo, '11. Glicogênese', 'Formação de reserva', 'Intermediário', 15, 8);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_metabolismo, '12. Glicogenólise', 'Quebra da reserva', 'Intermediário', 15, 9);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_metabolismo, '13. Gliconeogênese', 'Formação de nova glicose', 'Avançado', 20, 10);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_metabolismo, '14. Integração metabólica', 'Visão geral do metabolismo', 'Avançado', 25, 11);

    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_regulacao, '7. Insulina', 'Papel anabólico e hipoglicemiante', 'Intermediário', 15, 12);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_regulacao, '8. Glucagon', 'Papel catabólico e hiperglicemiante', 'Intermediário', 15, 13);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_regulacao, '9. Regulação da glicemia', 'Homeostase glicêmica', 'Avançado', 20, 14);

    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_clinica, '15. Diabetes mellitus', 'Fisiopatologia da diabetes', 'Avançado', 20, 15);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_clinica, '16. Exames laboratoriais', 'Glicemia de jejum, TTOG, HbA1c', 'Intermediário', 15, 16);
    INSERT INTO public.lessons (module_id, title, objective, difficulty, estimated_minutes, order_index) VALUES (mod_clinica, '17. Aplicações clínicas', 'Casos práticos de bioquímica clínica', 'Avançado', 15, 17);

    -- 4. Create Quizzes for Lessons
    INSERT INTO public.questions (discipline_id, topic_id, lesson_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
    VALUES 
    ('d2', 't_glicose', les_1, 'Qual é a fórmula da Glicose?', 'C5H10O5', 'C6H12O6', 'C12H22O11', 'CH4', 'C2H6O', 'b', 'A glicose é uma hexose, possuindo 6 carbonos.', 'easy'),
    ('d2', 't_glicose', les_2, 'A glicose é classificada estruturalmente como uma:', 'Ceto-pentose', 'Aldo-hexose', 'Ceto-hexose', 'Aldo-pentose', 'Dissacarídeo', 'b', 'A glicose possui 6 carbonos e um grupo funcional aldeído.', 'medium');

    -- 5. Create Mini-Simulado (Questions with no lesson_id)
    INSERT INTO public.questions (discipline_id, topic_id, lesson_id, question, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty)
    VALUES 
    ('d2', 't_glicose', null, 'Qual transportador (GLUT) é dependente de insulina e expresso no tecido adiposo e muscular?', 'GLUT-1', 'GLUT-2', 'GLUT-3', 'GLUT-4', 'GLUT-5', 'd', 'O GLUT-4 é dependente de insulina e regula a entrada de glicose nos tecidos muscular e adiposo.', 'medium'),
    ('d2', 't_glicose', null, 'Qual enzima converte a Glicose-6-Fosfato de volta em Glicose livre no fígado?', 'Glicoquinase', 'Hexoquinase', 'Glicose-6-fosfatase', 'Fosfofrutoquinase-1', 'Piruvato quinase', 'c', 'A glicose-6-fosfatase é encontrada no retículo endoplasmático do fígado (e rins) e permite a liberação de glicose livre na corrente sanguínea.', 'hard'),
    ('d2', 't_glicose', null, 'A via metabólica responsável por sintetizar glicose a partir de compostos não carboidratos é a:', 'Glicólise', 'Glicogenólise', 'Gliconeogênese', 'Glicogênese', 'Via das pentoses fosfato', 'c', 'A gliconeogênese ocorre no fígado e converte lactato, aminoácidos glicogênicos e glicerol em glicose.', 'medium');

END $$;
