BEGIN;
DELETE FROM books;
DELETE FROM topics;
DELETE FROM disciplines;

INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('anatomia', 'Anatomia', 'default', 'Ciências Básicas', 24);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('fisiologia', 'Fisiologia', 'default', 'Ciências Básicas', 20);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('histologia', 'Histologia', 'default', 'Ciências Básicas', 16);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('bioquimica', 'Bioquímica', 'default', 'Ciências Básicas', 22);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('biologia-molecular', 'Biologia Molecular', 'default', 'Ciências Básicas', 18);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('genetica', 'Genética', 'default', 'Ciências Básicas', 19);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('microbiologia', 'Microbiologia', 'default', 'Ciências Biomédicas', 26);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('imunologia', 'Imunologia', 'default', 'Ciências Biomédicas', 18);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('parasitologia', 'Parasitologia', 'default', 'Ciências Biomédicas', 21);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('patologia', 'Patologia', 'default', 'Ciências Biomédicas', 23);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('hematologia', 'Hematologia', 'default', 'Ciências Biomédicas', 15);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('farmacologia', 'Farmacologia', 'default', 'Ciências Biomédicas', 20);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('citologia', 'Citologia', 'default', 'Ciências Básicas', 12);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('embriologia', 'Embriologia', 'default', 'Ciências Básicas', 14);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('epidemiologia', 'Epidemiologia', 'default', 'Saúde Coletiva', 13);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('analises-clinicas', 'Análises Clínicas', 'default', 'Prática Laboratorial', 25);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('toxicologia', 'Toxicologia', 'default', 'Ciências Biomédicas', 11);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('biomedicina-estetica', 'Biomedicina Estética', 'default', 'Prática Laboratorial', 17);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('imagenologia', 'Imagenologia', 'default', 'Prática Laboratorial', 14);
INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('biosseguranca', 'Biossegurança', 'default', 'Prática Laboratorial', 9);

INSERT INTO topics (id, discipline_id, title, has_content, order_index) VALUES ('bioquimica_t1', 'bioquimica', 'Estrutura e função de proteínas', true, 0);
INSERT INTO topics (id, discipline_id, title, has_content, order_index) VALUES ('bioquimica_t2', 'bioquimica', 'Enzimas e cinética enzimática', true, 1);
INSERT INTO topics (id, discipline_id, title, has_content, order_index) VALUES ('bioquimica_t3', 'bioquimica', 'Metabolismo de carboidratos', true, 2);
INSERT INTO topics (id, discipline_id, title, has_content, order_index) VALUES ('bioquimica_t4', 'bioquimica', 'Ciclo de Krebs', true, 3);
INSERT INTO topics (id, discipline_id, title, has_content, order_index) VALUES ('bioquimica_t5', 'bioquimica', 'Metabolismo lipídico', true, 4);
INSERT INTO topics (id, discipline_id, title, has_content, order_index) VALUES ('anatomia_t1', 'anatomia', 'Sistema esquelético axial', true, 0);
INSERT INTO topics (id, discipline_id, title, has_content, order_index) VALUES ('anatomia_t2', 'anatomia', 'Sistema muscular', true, 1);
INSERT INTO topics (id, discipline_id, title, has_content, order_index) VALUES ('anatomia_t3', 'anatomia', 'Sistema cardiovascular', true, 2);

INSERT INTO books (id, discipline_id, title, author, edition, level, description) VALUES ('b1', 'bioquimica', 'Bioquímica Ilustrada', 'Denise Ferrier', '8ª edição', 'Intermediário', 'Referência clássica para o metabolismo e vias bioquímicas com foco clínico.');
INSERT INTO books (id, discipline_id, title, author, edition, level, description) VALUES ('b2', 'bioquimica', 'Princípios de Bioquímica de Lehninger', 'Nelson & Cox', '7ª edição', 'Avançado', 'Texto de aprofundamento com base molecular detalhada.');
INSERT INTO books (id, discipline_id, title, author, edition, level, description) VALUES ('b3', 'microbiologia', 'Microbiologia Médica', 'Murray, Rosenthal & Pfaller', '9ª edição', 'Intermediário', 'Base para bacteriologia, virologia e micologia médica.');
INSERT INTO books (id, discipline_id, title, author, edition, level, description) VALUES ('b4', 'microbiologia', 'Microbiologia de Brock', 'Madigan et al.', '15ª edição', 'Avançado', 'Fundamentos gerais e ecologia microbiana.');
INSERT INTO books (id, discipline_id, title, author, edition, level, description) VALUES ('b5', 'anatomia', 'Anatomia Humana', 'Keith Moore', '9ª edição', 'Iniciante', 'Texto introdutório com ênfase em correlações clínicas.');
INSERT INTO books (id, discipline_id, title, author, edition, level, description) VALUES ('b6', 'anatomia', 'Atlas de Anatomia Humana', 'Frank Netter', '8ª edição', 'Todos os níveis', 'Atlas ilustrado de referência visual.');
INSERT INTO books (id, discipline_id, title, author, edition, level, description) VALUES ('b7', 'genetica', 'Genética Médica', 'Jorde, Carey & Bamshad', '6ª edição', 'Intermediário', 'Genética humana aplicada à prática clínica.');
INSERT INTO books (id, discipline_id, title, author, edition, level, description) VALUES ('b8', 'patologia', 'Robbins Patologia Básica', 'Kumar, Abbas & Aster', '10ª edição', 'Avançado', 'Referência central em patologia geral e sistêmica.');

COMMIT;
