-- Script para adicionar livros na tabela books

INSERT INTO public.books (id, discipline_id, title, author, edition, level, description) VALUES
-- Livros usando os IDs descritivos
('b1', 'bioquimica', 'Bioquímica Ilustrada', 'Denise Ferrier', '8ª edição', 'Intermediário', 'Referência clássica para o metabolismo e vias bioquímicas com foco clínico.'),
('b2', 'bioquimica', 'Princípios de Bioquímica de Lehninger', 'Nelson & Cox', '7ª edição', 'Avançado', 'Texto de aprofundamento com base molecular detalhada.'),
('b3', 'microbiologia', 'Microbiologia Médica', 'Murray, Rosenthal & Pfaller', '9ª edição', 'Intermediário', 'Base para bacteriologia, virologia e micologia médica.'),
('b4', 'microbiologia', 'Microbiologia de Brock', 'Madigan et al.', '15ª edição', 'Avançado', 'Fundamentos gerais e ecologia microbiana.'),
('b5', 'anatomia', 'Anatomia Humana', 'Keith Moore', '9ª edição', 'Iniciante', 'Texto introdutório com ênfase em correlações clínicas.'),
('b6', 'anatomia', 'Atlas de Anatomia Humana', 'Frank Netter', '8ª edição', 'Todos os níveis', 'Atlas ilustrado de referência visual.'),
('b7', 'genetica', 'Genética Médica', 'Jorde, Carey & Bamshad', '6ª edição', 'Intermediário', 'Genética humana aplicada à prática clínica.'),
('b8', 'patologia', 'Robbins Patologia Básica', 'Kumar, Abbas & Aster', '10ª edição', 'Avançado', 'Referência central em patologia geral e sistêmica.')

-- Apenas livros com IDs nominais reais
ON CONFLICT DO NOTHING;
