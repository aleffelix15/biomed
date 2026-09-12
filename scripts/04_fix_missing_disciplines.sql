-- Inserir ou atualizar disciplinas conforme os slugs locais
INSERT INTO public.disciplines (id, name, icon, category) VALUES 
('analises-clinicas', 'Análises Clínicas', 'TestTube', 'Prática Laboratorial'),
('anatomia', 'Anatomia Humana', 'Bone', 'Ciências Básicas'),
('biologia-molecular', 'Biologia Molecular', 'Dna', 'Ciências Básicas'),
('biomedicina-estetica', 'Biomedicina Estética', 'Sparkles', 'Prática Laboratorial'),
('bioquimica', 'Bioquímica', 'FlaskConical', 'Ciências Básicas'),
('biosseguranca', 'Biossegurança', 'Biohazard', 'Prática Laboratorial'),
('citologia', 'Citologia', 'Layers', 'Ciências Básicas'),
('embriologia', 'Embriologia', 'Egg', 'Ciências Básicas'),
('epidemiologia', 'Epidemiologia', 'Activity', 'Saúde Coletiva'),
('farmacologia', 'Farmacologia', 'Pill', 'Ciências Biomédicas'),
('fisiologia', 'Fisiologia Humana', 'HeartPulse', 'Ciências Básicas'),
('genetica', 'Genética', 'Dna', 'Ciências Básicas'),
('hematologia', 'Hematologia', 'Droplet', 'Ciências Biomédicas'),
('histologia', 'Histologia', 'Layers', 'Ciências Básicas'),
('imagenologia', 'Imagenologia', 'ScanLine', 'Prática Laboratorial'),
('imunologia', 'Imunologia', 'ShieldCheck', 'Ciências Biomédicas'),
('microbiologia', 'Microbiologia', 'Bug', 'Ciências Biomédicas'),
('parasitologia', 'Parasitologia', 'Bug', 'Ciências Biomédicas'),
('patologia', 'Patologia', 'Microscope', 'Ciências Biomédicas'),
('toxicologia', 'Toxicologia', 'Beaker', 'Ciências Biomédicas')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category;
