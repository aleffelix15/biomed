-- Inserir ou atualizar disciplinas conforme os slugs locais
INSERT INTO public.disciplines (id, slug, name, description) VALUES 
('analises-clinicas', 'analises-clinicas', 'Análises Clínicas', 'Estudo avançado de conceitos fundamentais para a prática e pesquisa em Biomedicina.'),
('anatomia', 'anatomia', 'Anatomia Humana', 'Exploração das estruturas do corpo humano e sua organização sistêmica.'),
('biologia-molecular', 'biologia-molecular', 'Biologia Molecular', 'Estudo das bases moleculares da vida, focando em DNA, RNA e síntese de proteínas.'),
('biomedicina-estetica', 'biomedicina-estetica', 'Biomedicina Estética', 'Aplicação de procedimentos estéticos baseados em conhecimentos biomédicos.'),
('bioquimica', 'bioquimica', 'Bioquímica', 'Estudo das reações químicas e biológicas nos organismos vivos, essencial para entender o metabolismo.'),
('biosseguranca', 'biosseguranca', 'Biossegurança', 'Estudo avançado de conceitos fundamentais para a prática e pesquisa em Biomedicina.'),
('citologia', 'citologia', 'Citologia', 'Estudo da estrutura, função e patologia das células.'),
('embriologia', 'embriologia', 'Embriologia', 'Estudo avançado de conceitos fundamentais para a prática e pesquisa em Biomedicina.'),
('epidemiologia', 'epidemiologia', 'Epidemiologia', 'Análise da distribuição e dos determinantes de saúde e doenças nas populações.'),
('farmacologia', 'farmacologia', 'Farmacologia', 'Estudo dos medicamentos, seus mecanismos de ação, interações e efeitos no organismo.'),
('fisiologia', 'fisiologia', 'Fisiologia Humana', 'Compreensão do funcionamento normal do corpo humano e seus mecanismos de regulação.'),
('genetica', 'genetica', 'Genética', 'Compreensão da hereditariedade e das variações genéticas na biologia humana.'),
('hematologia', 'hematologia', 'Hematologia', 'Estudo do sangue, seus componentes e distúrbios, fundamental para diagnósticos clínicos.'),
('histologia', 'histologia', 'Histologia', 'Exame microscópico dos tecidos biológicos e sua organização anatômica.'),
('imagenologia', 'imagenologia', 'Imagenologia', 'Estudo avançado de conceitos fundamentais para a prática e pesquisa em Biomedicina.'),
('imunologia', 'imunologia', 'Imunologia', 'Análise do sistema imune e suas respostas a patógenos e doenças.'),
('microbiologia', 'microbiologia', 'Microbiologia', 'Estudo dos microrganismos, incluindo bactérias, vírus e fungos, e seu impacto na saúde.'),
('parasitologia', 'parasitologia', 'Parasitologia', 'Investigação dos parasitas, seus ciclos de vida e as doenças que causam em humanos.'),
('patologia', 'patologia', 'Patologia', 'Estudo das doenças, suas causas, mecanismos e alterações estruturais nas células e tecidos.'),
('toxicologia', 'toxicologia', 'Toxicologia', 'Estudo dos efeitos adversos das substâncias químicas nos organismos vivos.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description;
