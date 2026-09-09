import os
import re

topics_content = {
    'bioquimica': {
        't1': '''# Estrutura e Função de Proteínas

As proteínas são macromoléculas formadas por cadeias de aminoácidos unidos por ligações peptídicas. A sequência de aminoácidos (estrutura primária) determina o enovelamento da cadeia em estruturas secundárias (alfa-hélices e folhas beta), terciárias (conformação tridimensional) e, em alguns casos, quaternárias (múltiplas subunidades).

As funções biológicas das proteínas são incrivelmente diversas, incluindo catálise enzimática (acelerando reações químicas), transporte (como a hemoglobina transportando oxigênio), suporte estrutural (como o colágeno e a queratina), defesa imunológica (anticorpos) e sinalização celular (hormônios como a insulina).

A desnaturação, causada por alterações de pH, temperatura ou força iônica, pode levar à perda da estrutura tridimensional e, consequentemente, da função da proteína, demonstrando a relação intrínseca entre forma e função biológica.

## Fontes
- Nelson, D. L., & Cox, M. M. (2014). Princípios de Bioquímica de Lehninger (6ª ed.). Artmed.
- Voet, D., & Voet, J. G. (2013). Bioquímica (4ª ed.). Artmed.
''',
        't2': '''# Enzimas e Cinética Enzimática

As enzimas são catalisadores biológicos, majoritariamente de natureza proteica, que aumentam a velocidade das reações químicas reduzindo a energia de ativação necessária, sem serem consumidas no processo. A especificidade enzimática é ditada pela complementaridade estrutural entre o sítio ativo da enzima e seu substrato específico.

A cinética de Michaelis-Menten descreve a velocidade das reações enzimáticas. Os principais parâmetros são o Vmax (velocidade máxima quando a enzima está saturada com substrato) e o Km (constante de Michaelis, que indica a afinidade da enzima pelo substrato). 

Fatores como temperatura, pH e a presença de inibidores (competitivos, não-competitivos ou acompetitivos) regulam a atividade enzimática. Inibidores enzimáticos são de extrema importância farmacológica, visto que muitas drogas atuam bloqueando enzimas específicas em vias patológicas.

## Fontes
- Nelson, D. L., & Cox, M. M. (2014). Princípios de Bioquímica de Lehninger (6ª ed.). Artmed.
- Devlin, T. M. (2011). Manual de Bioquímica com Correlações Clínicas (7ª ed.). Blucher.
''',
        't3': '''# Metabolismo de Carboidratos

O metabolismo de carboidratos envolve processos vitais de obtenção e armazenamento de energia. A via central de degradação da glicose é a glicólise, que ocorre no citosol celular e oxida a glicose a piruvato, gerando um saldo líquido de ATP e NADH. Em condições aeróbicas, o piruvato é descarboxilado a acetil-CoA, entrando no Ciclo de Krebs e, posteriormente, na cadeia respiratória. Em anaerobiose, ocorre a fermentação (lática no músculo).

O glicogênio serve como a principal reserva de carboidratos em animais (concentrado no fígado e músculo). Sua síntese (glicogenogênese) e degradação (glicogenólise) são rigorosamente reguladas por hormônios como insulina e glucagon. Quando a glicose escasseia, o corpo realiza a gliconeogênese (formação de glicose a partir de precursores não-carboidratos, como lactato, aminoácidos e glicerol) para manter a homeostase glicêmica.

## Fontes
- Nelson, D. L., & Cox, M. M. (2014). Princípios de Bioquímica de Lehninger (6ª ed.). Artmed.
- Champe, P. C., Harvey, R. A., & Ferrier, D. R. (2006). Bioquímica Ilustrada (3ª ed.). Artmed.
''',
        't4': '''# Ciclo de Krebs

O Ciclo de Krebs (ou Ciclo do Ácido Cítrico) é a via comum final de oxidação das moléculas combustíveis — carboidratos, ácidos graxos e aminoácidos. Localizado na matriz mitocondrial nos eucariotos, o ciclo oxida o grupo acetil do acetil-CoA a duas moléculas de CO2.

O objetivo principal do ciclo não é gerar grandes quantidades de ATP diretamente (gera apenas um GTP/ATP por volta), mas sim capturar elétrons de alta energia em carreadores reduzidos: NADH e FADH2. Estes carreadores transferem os elétrons para a cadeia transportadora de elétrons, onde a maior parte do ATP celular será produzida via fosforilação oxidativa. O ciclo também tem caráter anfibólico, fornecendo intermediários para vias biossintéticas (ex: síntese de aminoácidos, porfirinas e glicose).

## Fontes
- Nelson, D. L., & Cox, M. M. (2014). Princípios de Bioquímica de Lehninger (6ª ed.). Artmed.
- Voet, D., & Voet, J. G. (2013). Bioquímica (4ª ed.). Artmed.
''',
        't5': '''# Metabolismo Lipídico

Os lipídios constituem uma fonte altamente concentrada de energia e são armazenados principalmente como triacilgliceróis no tecido adiposo. A oxidação dos ácidos graxos ocorre via β-oxidação na matriz mitocondrial, clivando a cadeia carbônica de dois em dois carbonos para formar acetil-CoA, além de NADH e FADH2, que alimentam a produção de ATP.

Além da geração de energia, o metabolismo lipídico inclui a biossíntese de ácidos graxos, triglicerídeos e colesterol (importante para membranas celulares e síntese de hormônios esteróides e ácidos biliares). Durante jejum prolongado ou diabetes descompensado, a produção excessiva de acetil-CoA desvia para a formação de corpos cetônicos no fígado, servindo como combustível alternativo para órgãos como o cérebro.

## Fontes
- Nelson, D. L., & Cox, M. M. (2014). Princípios de Bioquímica de Lehninger (6ª ed.). Artmed.
- Harvey, R. A., & Ferrier, D. R. (2012). Bioquímica Ilustrada (5ª ed.). Artmed.
'''
    },
    'anatomia': {
        't1': '''# Sistema Esquelético Axial

O sistema esquelético axial é a parte central do esqueleto humano, formando o eixo longitudinal do corpo. Composto por 80 ossos, inclui o crânio, a coluna vertebral, o osso hioide, os ossículos auditivos, as costelas e o esterno. 

O crânio protege o encéfalo e os órgãos dos sentidos, e é subdividido em neurocrânio e viscerocrânio. A coluna vertebral, composta por vértebras articuladas intercaladas com discos intervertebrais, protege a medula espinhal, sustenta o peso da cabeça e do tronco, e permite a flexibilidade do corpo. A caixa torácica, formada pelo esterno e costelas, resguarda órgãos torácicos vitais como o coração e os pulmões, além de auxiliar no processo respiratório (movimentação mecânica).

As principais funções do esqueleto axial são a proteção dos órgãos centrais, suporte do peso corpóreo superior e ancoragem para músculos relacionados à locomoção, respiração e movimentos da cabeça.

## Fontes
- Moore, K. L., Dalley, A. F., & Agur, A. M. R. (2014). Anatomia Orientada para a Clínica (7ª ed.). Guanabara Koogan.
- Tortora, G. J., & Derrickson, B. (2016). Princípios de Anatomia e Fisiologia (14ª ed.). Guanabara Koogan.
''',
        't2': '''# Sistema Muscular

O sistema muscular é responsável pela locomoção do corpo, manutenção da postura e produção de calor, sendo composto por três tipos de tecido muscular: estriado esquelético (contração voluntária), estriado cardíaco (contração involuntária) e liso (contração involuntária em órgãos viscerais e vasos sanguíneos).

No contexto biomédico, o foco primário frequentemente reside na fisiologia da contração muscular. A unidade funcional do músculo esquelético é o sarcômero, formado por filamentos finos de actina e filamentos espessos de miosina. A contração é desencadeada pela liberação de cálcio do retículo sarcoplasmático em resposta a um potencial de ação, promovendo a ligação das cabeças de miosina à actina, em um ciclo dependente de hidrólise de ATP (Teoria dos Filamentos Deslizantes).

## Fontes
- Guyton, A. C., & Hall, J. E. (2017). Tratado de Fisiologia Médica (13ª ed.). Elsevier.
- Moore, K. L., Dalley, A. F., & Agur, A. M. R. (2014). Anatomia Orientada para a Clínica (7ª ed.). Guanabara Koogan.
''',
        't3': '''# Sistema Cardiovascular

O sistema cardiovascular atua como o principal sistema de transporte do organismo. Constituído pelo coração (bomba propulsora) e por uma rede contínua de vasos sanguíneos (artérias, veias e capilares), assegura o suprimento adequado de oxigênio e nutrientes para as células, e a remoção de dióxido de carbono e resíduos metabólicos.

O coração possui quatro câmaras (dois átrios e dois ventrículos) e funciona como duas bombas em série: a circulação pulmonar (sangue venoso para os pulmões para oxigenação) e a circulação sistêmica (sangue arterial para o restante do corpo). O débito cardíaco e a resistência vascular periférica regulam a pressão arterial. O sistema de condução elétrica intrínseco (nó sinoatrial a fibras de Purkinje) garante o batimento rítmico coordenado, essencial para a eficiência do bombeamento.

## Fontes
- Guyton, A. C., & Hall, J. E. (2017). Tratado de Fisiologia Médica (13ª ed.). Elsevier.
- Tortora, G. J., & Derrickson, B. (2016). Princípios de Anatomia e Fisiologia (14ª ed.). Guanabara Koogan.
'''
    }
}

base_dir = r"c:\Users\aleff\OneDrive\Documents\biostudy\src\data\content"
os.makedirs(base_dir, exist_ok=True)

for discipline, topics in topics_content.items():
    discipline_dir = os.path.join(base_dir, discipline)
    os.makedirs(discipline_dir, exist_ok=True)
    for topic_id, content in topics.items():
        with open(os.path.join(discipline_dir, f"{topic_id}.md"), 'w', encoding='utf-8') as f:
            f.write(content)

# Update topics.js to add hasContent: true for these specific ones
topics_path = r"c:\Users\aleff\OneDrive\Documents\biostudy\src\data\mock\topics.js"
with open(topics_path, 'r', encoding='utf-8') as f:
    topics_str = f.read()

# Replace with hasContent
for discipline, topics in topics_content.items():
    for topic_id in topics.keys():
        pattern = f'{{ id: "{topic_id}", title: "(.*?)", status: "(.*?)" }}'
        replacement = f'{{ id: "{topic_id}", title: "\\1", status: "\\2", hasContent: true }}'
        topics_str = re.sub(pattern, replacement, topics_str)

with open(topics_path, 'w', encoding='utf-8') as f:
    f.write(topics_str)

print("Created content and updated topics.js")
