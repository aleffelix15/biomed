export const labCategories = [
  { id: 'techniques', title: 'Técnicas Laboratoriais', icon: 'Pipette', desc: 'Passo a passo, cuidados e reagentes.' },
  { id: 'equipment', title: 'Equipamentos', icon: 'Microscope', desc: 'Catálogo de aparelhos e funcionamento.' },
  { id: 'biosafety', title: 'Biossegurança', icon: 'ShieldAlert', desc: 'EPIs, EPCs e descarte de resíduos.' },
  { id: 'exams', title: 'Exames', icon: 'FileText', desc: 'Métodos, amostras e valores de referência.' },
  { id: 'procedures', title: 'Procedimentos', icon: 'ClipboardList', desc: 'Guias práticos de execução na rotina.' },
  { id: 'interpretations', title: 'Interpretação', icon: 'Activity', desc: 'Entenda os resultados e correlações clínicas.' },
  { id: 'clinicalCases', title: 'Casos Clínicos', icon: 'Stethoscope', desc: 'Pratique com casos clínicos reais.' }
];

export const labItems = [
  {
    id: 'equip_microscopio_optico',
    categoryId: 'equipment',
    title: 'Microscópio Óptico',
    description: 'Equipamento fundamental utilizado para observação de amostras microscópicas.',
    tags: ['Equipamentos', 'Microscopia'],
    content: [
      { type: 'section', title: 'Finalidade', text: 'Ampliar a imagem de objetos e amostras invisíveis a olho nu, permitindo a observação de células, bactérias, cristais e parasitas.' },
      { type: 'section', title: 'Princípio de Funcionamento', text: 'Utiliza um sistema de lentes objetivas e oculares associadas a uma fonte de luz visível (lâmpada halógena ou LED) para formar e ampliar a imagem da amostra. A luz atravessa o condensador, atinge a amostra, e é captada pela objetiva.' },
      { type: 'section', title: 'Principais Componentes', list: [
        'Oculares: Lentes por onde o observador visualiza a amostra (geralmente aumentam 10x).',
        'Objetivas: Lentes mais próximas à amostra (4x, 10x, 40x, 100x).',
        'Charriot: Mecanismo que movimenta a lâmina no plano horizontal (X e Y).',
        'Parafuso Macrométrico: Ajuste grosso de foco.',
        'Parafuso Micrométrico: Ajuste fino de foco.',
        'Condensador e Diafragma: Concentram e regulam a passagem de luz.'
      ] },
      { type: 'section', title: 'Cuidados e Manutenção', list: [
        'Sempre transportar segurando pelo braço e pela base.',
        'Limpar as lentes apenas com papel óptico para evitar riscos.',
        'Após o uso da objetiva de imersão (100x), remover o óleo imediatamente usando papel e solução adequada (ex: mistura de álcool-éter).',
        'Desligar a lâmpada antes de desconectar da tomada e guardar com capa protetora.'
      ] },
      { type: 'section', title: 'Aplicações na Biomedicina', text: 'Imprescindível na Hematologia (leitura de esfregaços e contagem diferencial), Urinálise (análise do sedimento urinário), Parasitologia (pesquisa de ovos e cistos), Microbiologia (Bacterioscopia/Gram) e Citologia.' }
    ],
    quiz: [
      {
        id: 'q_microscopio_1',
        text: 'Qual o cuidado imediato que deve ser tomado após a utilização da objetiva de 100x (imersão)?',
        options: [
          { id: 'A', text: 'Lavar a objetiva com água corrente e sabão neutro.' },
          { id: 'B', text: 'Remover o óleo de imersão utilizando papel óptico apropriado.' },
          { id: 'C', text: 'Deixar o óleo secar para proteger a lente contra arranhões.' },
          { id: 'D', text: 'Limpar a lente com papel toalha e álcool 70%.' }
        ],
        correctOption: 'B',
        explanation: 'O óleo de imersão, se deixado na lente, pode ressecar, danificar o revestimento antirreflexo e criar uma película opaca. Deve ser limpo sempre com papel óptico macio e soluções específicas de limpeza de lentes.'
      },
      {
        id: 'q_microscopio_2',
        text: 'A objetiva que possui o menor campo de visão e exige mais iluminação para focar perfeitamente é a de:',
        options: [
          { id: 'A', text: '4x' },
          { id: 'B', text: '10x' },
          { id: 'C', text: '40x' },
          { id: 'D', text: '100x' }
        ],
        correctOption: 'D',
        explanation: 'Quanto maior o aumento (100x), menor é a área observada (campo de visão) e menor a quantidade de luz que entra na lente, necessitando abrir o diafragma e usar óleo de imersão para concentrar a luz.'
      }
    ]
  },
  {
    id: 'exam_hemograma',
    categoryId: 'exams',
    title: 'Hemograma Completo',
    description: 'Um dos exames mais solicitados, avalia qualitativamente e quantitativamente os elementos figurados do sangue.',
    tags: ['Hematologia', 'Rotina'],
    content: [
      { type: 'section', title: 'Objetivo', text: 'Avaliar quantitativa e qualitativamente as células do sangue (Série Vermelha/Eritrograma, Série Branca/Leucograma e Série Plaquetária).' },
      { type: 'section', title: 'Amostra e Tubo', text: 'Sangue venoso total. O anticoagulante de escolha é o EDTA (tubo da tampa roxa), pois preserva bem a morfologia celular.' },
      { type: 'section', title: 'Princípio/Método', text: 'Atualmente é feito por equipamentos de automação hematológica que utilizam impedância elétrica, espalhamento de luz (laser scatter) ou radiofrequência, complementado pela leitura manual da lâmina (esfregaço) ao microscópio em caso de "flags" (alertas do equipamento).' },
      { type: 'section', title: 'Parâmetros Avaliados (Eritrograma)', list: [
        'Hemácias (Eritrócitos): Contagem total por mm³.',
        'Hemoglobina (Hb): Proteína carreadora de oxigênio (g/dL).',
        'Hematócrito (Ht): Porcentagem do volume de hemácias no sangue total (%).',
        'VCM (Volume Corpuscular Médio): Tamanho médio da hemácia (Micro/Normo/Macrocítica).',
        'HCM e CHCM: Quantidade de hemoglobina na hemácia (Hipo/Normocrômica).',
        'RDW: Índice de anisocitose (variação de tamanho).'
      ] },
      { type: 'section', title: 'Interferentes Comuns', list: [
        'Coágulos (inviabiliza a amostra).',
        'Hemólise (altera contagem e libera potássio/enzimas, embora o hemograma sofra menos impacto que exames bioquímicos).',
        'Lipemia severa (pode interferir na dosagem fotométrica da hemoglobina elevando CHCM falsamente).'
      ] }
    ],
    quiz: [
      {
        id: 'q_hemograma_1',
        text: 'Qual o anticoagulante utilizado na coleta de sangue para realização do Hemograma?',
        options: [
          { id: 'A', text: 'Citrato de Sódio (tampa azul)' },
          { id: 'B', text: 'EDTA (tampa roxa)' },
          { id: 'C', text: 'Heparina (tampa verde)' },
          { id: 'D', text: 'Tubo sem anticoagulante (tampa vermelha)' }
        ],
        correctOption: 'B',
        explanation: 'O EDTA preserva as estruturas celulares e impede a agregação plaquetária de forma muito mais eficiente que outros anticoagulantes, sendo o padrão ouro para a Hematologia.'
      }
    ]
  },
  {
    id: 'tech_centrifugacao',
    categoryId: 'techniques',
    title: 'Centrifugação de Amostras',
    description: 'Processo mecânico de separação de fases em amostras biológicas.',
    tags: ['Preparo', 'Bioquímica'],
    content: [
      { type: 'section', title: 'Objetivo', text: 'Separar componentes de uma mistura biológica baseando-se em suas diferentes densidades através da aplicação de força centrífuga.' },
      { type: 'section', title: 'Princípio', text: 'A rotação do rotor gera força centrífuga que empurra as partículas mais densas para o fundo do tubo (sedimento ou "pellet"), deixando os componentes menos densos na parte superior (sobrenadante).' },
      { type: 'section', title: 'Passo a Passo (Obtenção de Soro)', list: [
        '1. Coletar o sangue em tubo sem anticoagulante ou com ativador de coágulo.',
        '2. Aguardar a retração do coágulo (aprox. 30 minutos em temperatura ambiente).',
        '3. Posicionar os tubos no rotor da centrífuga garantindo o balanceamento exato (peso, volume e distribuição oposta).',
        '4. Centrifugar a cerca de 3000-3500 RPM por 10 a 15 minutos.',
        '5. Retirar com cuidado para não ressuspender as hemácias.',
        '6. O líquido amarelado na parte superior é o soro.'
      ] },
      { type: 'section', title: 'Possíveis Erros', list: [
        'Falta de balanceamento (pode quebrar os tubos e danificar o eixo da centrífuga).',
        'Centrifugação prematura de soro (gera fibrina em suspensão, entupindo sondas de automação).',
        'Força g excessiva (pode romper tubos ou lisar células - hemólise).'
      ] }
    ],
    quiz: [
      {
        id: 'q_centrifugacao_1',
        text: 'Qual a consequência da centrifugação prematura de uma amostra de sangue para obtenção de soro, antes da completa retração do coágulo?',
        options: [
          { id: 'A', text: 'Diminuição artificial da concentração de glicose.' },
          { id: 'B', text: 'Geração de fibrina em suspensão, que pode entupir sondas de automação.' },
          { id: 'C', text: 'Aumento da força G, resultando na quebra dos tubos.' },
          { id: 'D', text: 'Hemólise imediata e intensa de todas as hemácias.' }
        ],
        correctOption: 'B',
        explanation: 'Conforme descrito nos possíveis erros da técnica, a centrifugação prematura impede a retração completa do coágulo, gerando fibrina em suspensão que é um grande risco de entupimento para sondas de equipamentos automatizados.'
      }
    ]
  }
,
  // --- BIOSSEGURANÇA ---
  {
    id: 'bio_epis_laboratorio',
    categoryId: 'biosafety',
    title: 'EPIs no Laboratório Clínico',
    description: 'Equipamentos de Proteção Individual obrigatórios e suas indicações de uso seguro.',
    tags: ['EPI', 'Biossegurança'],
    content: [
      { type: 'section', title: 'Visão Geral', text: 'Os Equipamentos de Proteção Individual (EPIs) formam a primeira barreira física entre o profissional e o risco biológico ou químico, prevenindo exposições diretas durante o manuseio de amostras.' },
      { type: 'section', title: 'Principais EPIs', list: [
        'Jaleco (Avental): Deve ser de manga longa, fechado, com punho elástico, confeccionado em algodão ou material não inflamável. O uso é restrito à área técnica.',
        'Luvas de Procedimento: Protegem as mãos contra fluidos e agentes infecciosos. Devem ser trocadas entre pacientes e descartadas no lixo infectante.',
        'Óculos de Proteção: Evitam que respingos de material biológico ou produtos químicos atinjam a mucosa ocular.',
        'Máscaras: Podem ser cirúrgicas (risco de gotículas e respingos) ou N95/PFF2 (risco de aerossóis, como no setor de microbiologia ao manipular bacilos da tuberculose).'
      ] },
      { type: 'section', title: 'Regras de Ouro', list: [
        'Nunca circule com EPIs (especialmente jaleco e luvas) em áreas comuns como refeitórios, recepção ou fora do laboratório.',
        'Sempre higienize as mãos antes de calçar as luvas e imediatamente após retirá-las.',
        'Luvas não substituem a lavagem das mãos.'
      ] }
    ],
    quiz: [
      {
        id: 'q_bio_epi_1',
        text: 'Qual a conduta correta em relação ao uso do jaleco?',
        options: [
          { id: 'A', text: 'Pode ser utilizado em áreas comuns do laboratório, como a copa, desde que esteja visivelmente limpo.' },
          { id: 'B', text: 'O jaleco deve ser mantido abotoado, ter mangas longas e seu uso deve ser restrito exclusivamente à área técnica.' },
          { id: 'C', text: 'Jalecos de manga curta são preferíveis em laboratórios quentes, pois diminuem a transpiração.' },
          { id: 'D', text: 'O uso do jaleco substitui a necessidade de luvas em procedimentos de baixo risco.' }
        ],
        correctOption: 'B',
        explanation: 'O jaleco é uma barreira de proteção projetada para conter possíveis contaminações, logo, seu uso em áreas limpas (como refeitórios e recepção) ou aberto anula sua eficácia e espalha agentes patogênicos.'
      }
    ]
  },
  {
    id: 'bio_descarte_residuos',
    categoryId: 'biosafety',
    title: 'Classificação de Resíduos',
    description: 'Como descartar corretamente resíduos infectantes, químicos e perfurocortantes (RDC ANVISA).',
    tags: ['Resíduos', 'ANVISA'],
    content: [
      { type: 'section', title: 'Gerenciamento de Resíduos (PGRSS)', text: 'A RDC n° 222/2018 da ANVISA regulamenta o descarte em serviços de saúde. O descarte incorreto expõe profissionais e o meio ambiente a riscos gravíssimos.' },
      { type: 'section', title: 'Grupos de Resíduos', list: [
        'Grupo A (Infectantes): Risco biológico. Descarte em saco branco leitoso com símbolo de risco biológico. Ex: algodão com sangue, meios de cultura, tubos de coleta sem agulha.',
        'Grupo B (Químicos): Risco químico. Descarte em galões específicos rígidos. Ex: reagentes tóxicos, corantes hematológicos, fixadores.',
        'Grupo C (Radioativos): Risco radiológico. Caixas blindadas (chumbo). Ex: sobras de material de medicina nuclear.',
        'Grupo D (Comuns): Lixo comum ou reciclável (sem contaminação). Saco preto ou colorido para reciclagem. Ex: papel toalha do lavabo, embalagens de seringa.',
        'Grupo E (Perfurocortantes): Risco de corte/perfuração. Caixas rígidas amarelas de papelão resistente (Descarpack). Ex: agulhas, lâminas, escalpes, tubos capilares quebrados.'
      ] }
    ],
    quiz: [
      {
        id: 'q_bio_res_1',
        text: 'Onde deve ser descartada uma agulha utilizada para coleta de sangue e a embalagem plástica que a envolvia, respectivamente?',
        options: [
          { id: 'A', text: 'Ambas na caixa rígida amarela (Grupo E).' },
          { id: 'B', text: 'Agulha no lixo infectante (Grupo A) e embalagem no lixo comum (Grupo D).' },
          { id: 'C', text: 'Agulha na caixa rígida amarela (Grupo E) e embalagem no lixo comum (Grupo D).' },
          { id: 'D', text: 'Ambas no saco branco leitoso infectante (Grupo A).' }
        ],
        correctOption: 'C',
        explanation: 'A agulha é um perfurocortante e pertence ao Grupo E, devendo ir para a caixa amarela (Descarpack). A embalagem protetora não teve contato com o paciente, sendo lixo comum (Grupo D).'
      }
    ]
  },
  {
    id: 'bio_niveis_biosseguranca',
    categoryId: 'biosafety',
    title: 'Níveis de Biossegurança (NB)',
    description: 'Classificação dos laboratórios de NB-1 a NB-4 conforme a patogenicidade dos agentes.',
    tags: ['Risco Biológico', 'NB'],
    content: [
      { type: 'section', title: 'Classificação de Risco', text: 'Os laboratórios são divididos em níveis de biossegurança dependendo da virulência, transmissibilidade, e disponibilidade de profilaxia (vacinas/curas) dos agentes manipulados.' },
      { type: 'section', title: 'NB-1 e NB-2 (Rotina Comum)', list: [
        'NB-1: Agentes que não causam doença em humanos saudáveis (ex: Lactobacillus, E. coli não patogênica). Requer apenas pias, jaleco e boas práticas.',
        'NB-2: Agentes que causam doenças, mas têm tratamento e não são transmitidos pelo ar facilmente (ex: HIV, Salmonella). É o nível padrão da rotina laboratorial de análises clínicas. Exige acesso restrito, EPIs completos e Cabine de Segurança Biológica (CSB) para procedimentos que gerem aerossóis.'
      ] },
      { type: 'section', title: 'NB-3 e NB-4 (Alta Contenção)', list: [
        'NB-3: Agentes letais com transmissão respiratória severa, mas que possuem tratamento (ex: Mycobacterium tuberculosis). Requer pressão negativa no laboratório, portas duplas e EPIs respiratórios de alta eficiência.',
        'NB-4: Risco máximo. Agentes exóticos, letais, sem vacina ou tratamento (ex: vírus Ebola). Exige trajes de pressão positiva independentes e chuveiros de descontaminação.'
      ] }
    ],
    quiz: [
      {
        id: 'q_niveis_bio_1',
        text: 'Qual o Nível de Biossegurança (NB) considerado padrão para a rotina de um laboratório de análises clínicas, utilizado ao manipular amostras que podem conter agentes como HIV ou Salmonella?',
        options: [
          { id: 'A', text: 'NB-1' },
          { id: 'B', text: 'NB-2' },
          { id: 'C', text: 'NB-3' },
          { id: 'D', text: 'NB-4' }
        ],
        correctOption: 'B',
        explanation: 'Conforme descrito na classificação, o NB-2 é o nível padrão da rotina laboratorial de análises clínicas, destinado a agentes que causam doenças mas possuem tratamento e não são facilmente transmitidos pelo ar.'
      }
    ]
  },

  // --- PROCEDIMENTOS ---
  {
    id: 'proc_coleta_venosa',
    categoryId: 'procedures',
    title: 'Coleta de Sangue Venoso',
    description: 'Guia prático para a venopunção a vácuo, ordem correta dos tubos e garroteamento.',
    tags: ['Coleta', 'Fase Pré-Analítica'],
    content: [
      { type: 'section', title: 'Materiais Necessários', text: 'Agulha para coleta a vácuo (ou escalpe), adaptador (canhão), tubos de coleta a vácuo, algodão com álcool 70%, garrote, curativo e caixa de perfurocortantes.' },
      { type: 'section', title: 'Passo a Passo da Punção', list: [
        'Confirmar os dados do paciente, explicar o procedimento e verificar o jejum.',
        'Aplicar o garrote a cerca de 7-10 cm acima do local escolhido. O garroteamento não deve exceder 1 minuto para evitar hemoconcentração.',
        'Realizar a antissepsia do local de punção com álcool 70%, em movimentos circulares do centro para fora, e esperar secar.',
        'Introduzir a agulha com o bisel voltado para cima, num ângulo de 15 a 30 graus.',
        'Encaixar os tubos no canhão seguindo a ordem correta preconizada pelo CLSI.',
        'Remover o garrote ANTES de retirar a agulha.',
        'Realizar a homogeneização imediata dos tubos contendo anticoagulante (inversão suave 5 a 8 vezes).'
      ] },
      { type: 'section', title: 'Ordem dos Tubos (CLSI)', list: [
        '1º) Frascos de Hemocultura',
        '2º) Tubo tampa Azul (Citrato de Sódio - Coagulação)',
        '3º) Tubo tampa Vermelha ou Amarela (Sem anticoagulante / Com gel - Soro)',
        '4º) Tubo tampa Verde (Heparina)',
        '5º) Tubo tampa Roxa (EDTA - Hematologia)',
        '6º) Tubo tampa Cinza (Fluoreto - Glicose)'
      ] }
    ],
    quiz: [
      {
        id: 'q_proc_coleta_1',
        text: 'Qual o tempo máximo recomendado para a manutenção do garrote no braço do paciente durante a coleta de sangue?',
        options: [
          { id: 'A', text: 'Não há limite, desde que o sangue flua adequadamente.' },
          { id: 'B', text: '3 a 5 minutos, para garantir o ingurgitamento venoso.' },
          { id: 'C', text: '1 minuto, para evitar hemoconcentração e alteração nos exames.' },
          { id: 'D', text: '30 segundos no máximo, mesmo que o fluxo seja lento.' }
        ],
        correctOption: 'C',
        explanation: 'Deixar o garrote por mais de 1 minuto causa estase venosa, forçando a saída de água do vaso para os tecidos (hemoconcentração), o que aumenta falsamente exames como proteínas, colesterol e cálcio.'
      }
    ]
  },
  {
    id: 'proc_esfregaco_sanguineo',
    categoryId: 'procedures',
    title: 'Preparo de Esfregaço Sanguíneo',
    description: 'Técnica de distensão sanguínea em lâmina para avaliação morfológica das células.',
    tags: ['Hematologia', 'Lâmina'],
    content: [
      { type: 'section', title: 'Objetivo e Importância', text: 'O esfregaço (ou distensão) sanguíneo permite a coloração e a avaliação microscópica qualitativa das células do sangue. É vital para confirmar automações hematológicas e diagnosticar anemias, leucemias e infecções parasitárias.' },
      { type: 'section', title: 'Técnica da Cunha (Distensão)', list: [
        'Usar lâminas extremamente limpas e desengorduradas.',
        'Colocar uma gota de sangue venoso homogeneizado (EDTA) a cerca de 1 a 2 cm de uma das extremidades da lâmina.',
        'Apoiar uma lâmina extensora sobre a gota num ângulo de 30º a 45º, deixando o sangue espalhar-se por capilaridade na aresta da lâmina.',
        'Deslizar a lâmina extensora de forma rápida, contínua e uniforme até o fim, criando uma cauda (formato de língua).',
        'Deixar secar rapidamente ao ar livre.'
      ] },
      { type: 'section', title: 'Avaliação de um Bom Esfregaço', text: 'Um esfregaço ideal possui três regiões nítidas: cabeça, corpo e cauda (franja). A cauda é a região ideal para a leitura microscópica, pois nela as hemácias estão separadas sem se sobreporem ou se deformarem.' }
    ],
    quiz: [
      {
        id: 'q_esfregaco_1',
        text: 'Na técnica da cunha para preparo de esfregaço sanguíneo, qual é a região considerada ideal para a leitura microscópica e por quê?',
        options: [
          { id: 'A', text: 'A cabeça, pois concentra a maior quantidade de células por campo.' },
          { id: 'B', text: 'O corpo, pois ocorre o empilhamento em rouleaux das hemácias, facilitando a contagem.' },
          { id: 'C', text: 'A cauda (franja), pois nela as hemácias estão separadas sem se sobreporem ou se deformarem.' },
          { id: 'D', text: 'Qualquer região, desde que a coloração do esfregaço seja adequada.' }
        ],
        correctOption: 'C',
        explanation: 'A cauda (ou franja) é a região onde a gota de sangue fica mais bem distendida. Nela, as hemácias não ficam umas sobre as outras e não perdem sua morfologia original, o que permite uma leitura microscópica confiável e precisa.'
      }
    ]
  },
  {
    id: 'proc_coleta_urina_i',
    categoryId: 'procedures',
    title: 'Coleta de Urina Tipo I',
    description: 'Orientações e coleta correta da amostra de urina para exames de rotina.',
    tags: ['Urinálise', 'Fase Pré-Analítica'],
    content: [
      { type: 'section', title: 'Preparo do Paciente', text: 'A urina ideal para avaliação de rotina (EAS / Urina Tipo I) é a primeira da manhã, pois é mais concentrada e favorece a detecção de cilindros e células anormais. Contudo, qualquer micção após 2 a 4 horas de retenção pode ser utilizada.' },
      { type: 'section', title: 'Técnica do Jato Médio', list: [
        'Orientar higienização íntima com água e sabão (sem uso de antissépticos fortes) antes da coleta.',
        'Desprezar o primeiro jato de urina no vaso sanitário. Isso "lava" a uretra, removendo células escamosas e bactérias normais do meato uretral.',
        'Coletar o fluxo intermediário (jato médio) diretamente no frasco de boca larga limpo e seco.',
        'Desprezar o restante no vaso sanitário.'
      ] },
      { type: 'section', title: 'Conservação', text: 'A amostra deve ser processada no laboratório idealmente em até 1 a 2 horas. Caso não seja possível, deve ser refrigerada (2°C a 8°C) para impedir a multiplicação bacteriana, consumo da glicose e degradação de cilindros/células.' }
    ],
    quiz: [
      {
        id: 'q_proc_urina_1',
        text: 'Qual a justificativa clínica para a coleta do "jato médio" na Urina Tipo I?',
        options: [
          { id: 'A', text: 'Garantir que a urina possua uma concentração maior de glicose e proteínas.' },
          { id: 'B', text: 'Limpar a flora residente e as células escamosas do terço inferior da uretra, evitando contaminação da amostra.' },
          { id: 'C', text: 'Fazer com que apenas as bactérias renais alcancem o fundo do frasco.' },
          { id: 'D', text: 'Evitar que a urina entre em contato com o ar ambiente.' }
        ],
        correctOption: 'B',
        explanation: 'O primeiro jato carrega a microbiota comensal da uretra e do prepúcio/vagina. Ao descartá-lo, o jato médio representa com muito mais fidelidade a real situação da bexiga e rins.'
      }
    ]
  },

  // --- INTERPRETAÇÕES ---
  {
    id: 'interp_coagulograma',
    categoryId: 'interpretations',
    title: 'Coagulograma (TP e TTPA)',
    description: 'Compreendendo as vias de coagulação a partir do Tempo de Protrombina e Tromboplastina Parcial.',
    tags: ['Coagulação', 'Hemostasia'],
    content: [
      { type: 'section', title: 'Conceito', text: 'O Coagulograma avalia a hemostasia secundária (cascata de coagulação). Os testes principais são o Tempo de Protrombina (TP ou TAP) e o Tempo de Tromboplastina Parcial Ativada (TTPA).' },
      { type: 'section', title: 'Tempo de Protrombina (TP)', list: [
        'Avalia a Via Extrínseca e Comum (Fatores VII, X, V, II, I).',
        'Resultado normal: cerca de 11 a 14 segundos (INR ~1,0).',
        'Muito utilizado para monitoramento de pacientes em uso de anticoagulantes orais antagonistas da Vitamina K (ex: Varfarina/Marevan). Para esses pacientes, o INR alvo costuma ser 2,0 a 3,0.'
      ] },
      { type: 'section', title: 'Tempo de Tromboplastina Parcial Ativada (TTPA)', list: [
        'Avalia a Via Intrínseca e Comum (Fatores XII, XI, IX, VIII, X, V, II, I).',
        'Resultado normal: cerca de 25 a 35 segundos (a depender do reagente).',
        'Utilizado para monitorar terapias com Heparina Não Fracionada (HNF) e para investigação de Hemofilias (A = def. de FVIII; B = def. de FIX).'
      ] },
      { type: 'section', title: 'Interpretação Cruzada', text: 'TP alongado com TTPA normal sugere problema na via extrínseca (Fator VII). TTPA alongado com TP normal sugere via intrínseca (VIII, IX, XI). Se AMBOS estão alongados, o defeito está na via comum (Fator X, V, II, I) ou é deficiência múltipla (cirrose severa, CIVD).' }
    ],
    quiz: [
      {
        id: 'q_interp_coag_1',
        text: 'Paciente com sangramento apresenta TTPA acentuadamente prolongado, porém com Tempo de Protrombina (TP) normal. Este perfil é compatível com qual doença clássica?',
        options: [
          { id: 'A', text: 'Uso excessivo de Varfarina.' },
          { id: 'B', text: 'Deficiência isolada de Fator VII.' },
          { id: 'C', text: 'Hemofilia A (deficiência do Fator VIII).' },
          { id: 'D', text: 'Trombocitopenia (plaquetas baixas).' }
        ],
        correctOption: 'C',
        explanation: 'A Hemofilia A (deficiência do Fator VIII) afeta a Via Intrínseca, que é avaliada pelo TTPA (ficando alongado). O TP avalia a via Extrínseca (Fator VII), logo permanecerá normal.'
      }
    ]
  },
  {
    id: 'interp_marcadores_inflamatorios',
    categoryId: 'interpretations',
    title: 'Marcadores Inflamatórios: VHS e PCR',
    description: 'Diferenças de cinética e interpretação clínica da Velocidade de Hemossedimentação e Proteína C Reativa.',
    tags: ['Imunologia', 'Inflamação'],
    content: [
      { type: 'section', title: 'O que são?', text: 'VHS e PCR são testes de fase aguda sensíveis, porém inespecíficos. Eles indicam que há uma inflamação, infecção, trauma ou neoplasia ativa no corpo, mas não dizem exatamente onde ou qual a causa.' },
      { type: 'section', title: 'PCR (Proteína C Reativa)', list: [
        'Cinética Rápida: Eleva-se precocemente (6 a 12 horas após o estímulo inflamatório) e cai rapidamente quando a inflamação é resolvida.',
        'Reflete a fase aguda imediata de infecções bacterianas e processos inflamatórios severos.',
        'Na variante PCR-us (Ultrassensível), mede baixas concentrações inflamatórias basais, servindo como marcador de risco cardiovascular.'
      ] },
      { type: 'section', title: 'VHS (Velocidade de Hemossedimentação)', list: [
        'Cinética Lenta: Demora dias para subir ao máximo e semanas para normalizar, mesmo após a cura clínica.',
        'Mede a precipitação das hemácias, que caem mais rápido (VHS elevado) na presença de proteínas plasmáticas alteradas, principalmente fibrinogênio e imunoglobulinas.',
        'Sofre interferência de diversos fatores: anemias (aumenta o VHS), policitemia (reduz o VHS), idade e gravidez.'
      ] }
    ],
    quiz: [
      {
        id: 'q_marcadores_1',
        text: 'Qual a principal diferença na cinética de resposta entre a Proteína C Reativa (PCR) e a Velocidade de Hemossedimentação (VHS) diante de um quadro inflamatório?',
        options: [
          { id: 'A', text: 'O VHS eleva-se precocemente nas primeiras horas, enquanto a PCR demora dias para subir.' },
          { id: 'B', text: 'A PCR é muito específica para infecções virais, enquanto o VHS indica apenas inflamações crônicas.' },
          { id: 'C', text: 'A PCR eleva-se precocemente e cai rapidamente após a cura, já o VHS possui cinética lenta e demora semanas para normalizar.' },
          { id: 'D', text: 'Ambas possuem a mesma cinética, mas a PCR não sofre interferência de anemias.' }
        ],
        correctOption: 'C',
        explanation: 'A PCR é um marcador de fase aguda com cinética rápida (eleva-se em 6 a 12 horas e cai assim que a inflamação cede). O VHS depende da concentração de proteínas plasmáticas de meia-vida mais longa (como fibrinogênio), o que faz com que sua elevação e normalização sejam muito mais lentas.'
      }
    ]
  },
  {
    id: 'interp_tsam',
    categoryId: 'interpretations',
    title: 'Leitura de Antibiograma (TSAM)',
    description: 'Como interpretar Testes de Sensibilidade aos Antimicrobianos por difusão em disco.',
    tags: ['Microbiologia', 'Resistência'],
    content: [
      { type: 'section', title: 'Princípio do Método (Kirby-Bauer)', text: 'Discos de papel impregnados com concentrações padronizadas de antibióticos são aplicados sobre ágar Mueller-Hinton recém-inoculado com a bactéria. O antibiótico difunde-se no ágar, inibindo o crescimento em um halo circular.' },
      { type: 'section', title: 'Leitura dos Halos', text: 'Após incubação de 16-24h a 35°C, mede-se o diâmetro do halo de inibição em milímetros (mm). O diâmetro NUNCA deve ser interpretado como "quanto maior o halo, melhor o antibiótico" diretamente, pois cada droga tem uma capacidade de difusão química diferente.' },
      { type: 'section', title: 'Interpretação (Padrão BrCAST / EUCAST)', list: [
        'S (Sensível): O isolado bacteriano é inibido pelas concentrações comumente alcançadas pela dose padrão da droga.',
        'I (Suscetível, aumento da exposição): Pode haver sucesso clínico se a dose administrada for aumentada ou se o fármaco se concentrar no sítio da infecção.',
        'R (Resistente): Há alta probabilidade de falha terapêutica, pois o isolado possui mecanismos de resistência.'
      ] },
      { type: 'section', title: 'Mecanismos Importantes', text: 'Certas resistências fenotípicas inativam classes inteiras. Exemplo: Produção de ESBL (Betalactamase de Espectro Estendido) por E. coli indica resistência a cefalosporinas de todas as gerações, mesmo que o halo in vitro pareça intermediário ou grande.' }
    ],
    quiz: [
      {
        id: 'q_tsam_1',
        text: 'Ao interpretar um Antibiograma (TSAM) por difusão em disco, por que é incorreto afirmar que "quanto maior o halo de inibição, melhor ou mais potente é o antibiótico"?',
        options: [
          { id: 'A', text: 'Porque halos muito grandes indicam sempre que a bactéria sofreu mutação durante o teste.' },
          { id: 'B', text: 'Porque cada antibiótico possui uma capacidade de difusão química diferente no ágar, exigindo tabelas padronizadas para interpretar a medida em milímetros.' },
          { id: 'C', text: 'Porque o halo de inibição reflete apenas a velocidade de crescimento bacteriano, e não a ação da droga.' },
          { id: 'D', text: 'Porque halos maiores indicam que o disco de papel continha uma concentração tóxica para humanos.' }
        ],
        correctOption: 'B',
        explanation: 'O diâmetro do halo depende fortemente do tamanho da molécula do antibiótico e de sua capacidade de se difundir quimicamente no ágar Mueller-Hinton. Drogas com moléculas maiores difundem menos (formando halos menores), mesmo sendo altamente eficazes contra a bactéria.'
      }
    ]
  },

  // --- CASOS CLÍNICOS (Utilizando o novo formato) ---
  {
    id: 'caso_anemia_ferropriva_01',
    categoryId: 'clinicalCases',
    title: 'Fadiga e Palidez em Mulher de 32 anos',
    description: 'Paciente com astenia crônica e alterações no eritrograma.',
    tags: ['Hematologia', 'Caso Clínico'],
    scenario: 'Paciente feminina, 32 anos, procura a clínica queixando-se de astenia crônica, sonolência diurna, queda de cabelo e unhas quebradiças (coiloníquia) nos últimos 4 meses. Relata hipermenorreia (ciclos abundantes) persistente. Negou melena ou sangramentos visíveis adicionais.\n\n**Hemograma Completo:**\n- **Eritrócitos:** 3,8 milhões/mm³ (VR: 4,2 a 5,4)\n- **Hemoglobina:** 9,0 g/dL (VR: 12,0 a 16,0)\n- **Hematócrito:** 28% (VR: 36 a 46%)\n- **VCM (Volume Corpuscular Médio):** 70 fL (VR: 80 a 100 fL)\n- **HCM (Hemoglobina Corpuscular Média):** 23 pg (VR: 26 a 34 pg)\n- **CHCM:** 31% (VR: 32 a 36%)\n- **RDW:** 19,2% (VR: 11,5 a 14,5%)\n\n**Leucograma:** Global de 6.500/mm³ com diferencial normal.\n**Plaquetas:** 450.000/mm³ (Trombocitose reativa leve).\n\n**Cinética do Ferro:**\n- **Ferro Sérico:** 30 µg/dL (VR: 60 a 150)\n- **Ferritina:** 8 ng/mL (VR: 15 a 150 ng/mL)\n- **TIBC (Capacidade Total de Ligação do Ferro):** 450 µg/dL (VR: 250 a 360)\n- **Saturação de Transferrina:** 6,6% (VR: 20 a 50%)',
    question: 'Com base na integração dos achados hematológicos e da cinética do ferro, qual é o diagnóstico definitivo e o mecanismo fisiopatológico primário explicando as alterações hematimétricas?',
    reveal: '**Diagnóstico Definitivo:** Anemia Microcítica Hipocrômica severa por Deficiência de Ferro (Anemia Ferropriva).\n\n**Raciocínio Clínico e Fisiopatologia:**\nA queda da Hb e do Ht consolida o quadro de anemia. O **VCM de 70 fL** (microcitose) e o **HCM de 23 pg** (hipocromia) indicam que a medula óssea está produzindo hemácias menores e com menor conteúdo de hemoglobina, classicamente associado à falha na síntese do grupo Heme pela falta do íon Fe²⁺. \nO **RDW elevado (19,2%)** reflete anisocitose (heterogeneidade no tamanho celular), diferenciando este quadro da Talassemia Menor (onde o RDW costuma ser normal). A trombocitose leve é reativa à hipóxia tecidual e ao estímulo da eritropoietina que pode possuir reatividade cruzada com progenitores plaquetários.\n\n**Análise do Ferro:** O esgotamento dos estoques (Ferritina de 8 ng/mL) precedeu a queda do ferro sérico. A elevação compensatória do TIBC reflete a tentativa hepática de aumentar a captação de ferro pela superprodução de transferrina.\n\n**Próximo Passo:** Investigação ginecológica e reposição de sulfato ferroso, monitorando o pico de reticulócitos esperado para 7 a 10 dias após o início da terapia.'
  },
  {
    id: 'caso_itu_02',
    categoryId: 'clinicalCases',
    title: 'Disúria e Urgência Miccional',
    description: 'Alterações no EAS e bacteriúria no exame de rotina.',
    tags: ['Urinálise', 'Microbiologia'],
    scenario: 'Paciente feminina, 24 anos, apresenta disúria, polaciúria (urgência e aumento da frequência miccional) e dor suprapúbica há 3 dias. Nega febre, dor lombar ou vômitos.\n\n**EAS (Urina Tipo 1):**\n- **Cor/Aspecto:** Amarelo-turvo\n- **Densidade:** 1.020 (VR: 1.005 - 1.030)\n- **pH:** 6,5 (VR: 5,0 - 7,0)\n- **Proteínas:** Traços (Normal: Ausente)\n- **Nitrito:** Positivo (+)\n- **Esterase Leucocitária:** Positiva (+++)\n\n**Sedimentoscopia Microscópica:**\n- **Leucócitos:** > 50 por campo (VR: até 5/campo)\n- **Hemácias:** 10 por campo (VR: até 3/campo)\n- **Células Epiteliais:** Raras\n- **Bactérias:** Maciça (++++) \n- **Cilindros:** Ausentes\n\n**Urocultura:** Crescimento de > 100.000 UFC/mL de bacilos Gram-negativos em ágar MacConkey, lactose-positivos.',
    question: 'Qual é o provável agente etiológico e qual a base bioquímica que explica a positividade simultânea da Esterase Leucocitária e do Nitrito na fita reagente?',
    reveal: '**Diagnóstico:** Infecção do Trato Urinário (ITU) não-complicada (Cistite), provável etiologia por *Escherichia coli*.\n\n**Raciocínio Clínico e Fisiopatologia:**\nA ausência de febre e dor lombar (sinal de Giordano negativo) localiza a infecção na bexiga (cistite), excluindo pielonefrite. O sedimento urinário com intensa piúria (>50 leucócitos/campo) e bacteriúria confirmam o processo inflamatório-infeccioso.\n\n**Base Bioquímica das Fitas:**\n- **Esterase Leucocitária (+++):** Detecta a presença de enzimas (esterases) liberadas por grânulos azurófilos de neutrófilos íntegros ou lisados, sendo um marcador altamente sensível para piúria.\n- **Nitrito (+):** Bactérias Gram-negativas da família *Enterobacteriaceae* (especialmente *E. coli*, *Klebsiella spp.*, *Proteus spp.*) possuem a enzima **nitrato redutase**, que reduz o nitrato dietético filtrado na urina para nitrito. \n\n**Próximo Passo:** O crescimento de bacilos Gram-negativos fermentadores de lactose isolado em alta contagem (>100.000 UFC/mL) exige liberação do Antibiograma (TSAM) para direcionar a terapia antimicrobiana (comumente Fosfomicina, Nitrofurantoína ou Sulfametoxazol-Trimetoprima).'
  },
  {
    id: 'caso_hepatite_03',
    categoryId: 'clinicalCases',
    title: 'Icterícia e Enzimas Elevadas',
    description: 'Paciente com pele amarelada e transaminases significativamente alteradas.',
    tags: ['Bioquímica', 'Caso Clínico'],
    scenario: 'Homem de 45 anos, previamente hígido, comparece ao pronto-socorro relatando náuseas, astenia, hiporexia e urina cor de "coca-cola" (colúria) há 1 semana. Nas últimas 48h, evoluiu com icterícia escleral e cutânea. Nega etilismo, uso de hepatotóxicos ou febre recente.\n\n**Bioquímica Sérica e Perfil Hepático:**\n- **AST (TGO):** 1.450 U/L (VR: < 40 U/L)\n- **ALT (TGP):** 1.890 U/L (VR: < 41 U/L)\n- **Relação AST/ALT (De Ritis):** 0,76\n- **Fosfatase Alcalina (FA):** 130 U/L (VR: 40 a 129 U/L)\n- **Gama-GT (GGT):** 95 U/L (VR: 10 a 71 U/L)\n- **Bilirrubina Total:** 8,5 mg/dL (VR: < 1,2 mg/dL)\n- **Bilirrubina Direta (Conjugada):** 6,1 mg/dL (VR: < 0,3 mg/dL)\n- **Bilirrubina Indireta:** 2,4 mg/dL (VR: < 0,9 mg/dL)\n- **Tempo de Protrombina (TAP/INR):** INR 1,2 (VR: 1,0)',
    question: 'Qual o padrão predominante de lesão hepática (Hepatocelular vs. Colestático) e o que a fração das bilirrubinas nos diz sobre o mecanismo da icterícia e da colúria?',
    reveal: '**Diagnóstico de Padrão:** Lesão Hepatocelular Aguda Severa (Padrão Hepatocítico), muito sugestiva de Hepatite Viral Aguda.\n\n**Raciocínio Clínico e Fisiopatologia:**\nAs transaminases (AST e ALT) encontram-se elevadas em níveis astronômicos (>30x o limite superior), o que sinaliza lise maciça de hepatócitos. A ALT maior que a AST (relação de Ritis < 1) é característica típica de hepatites virais agudas, enquanto danos alcoólicos costumam apresentar AST > ALT.\n\nA ausência de elevação substancial de Fosfatase Alcalina e GGT descarta a Colestase (obstrução biliar) como evento primário.\n\n**Metabolismo da Bilirrubina:** O hepatócito doente ainda consegue conjugar a bilirrubina através da enzima *UGT1A1* (daí o aumento maciço da Bilirrubina Direta), porém, a inflamação e o edema sinusoidal impedem sua excreção eficiente para os canalículos biliares. Consequentemente, a bilirrubina conjugada reflui para o plasma. Por ser hidrossolúvel, a fração direta é filtrada pelos glomérulos renais, causando o escurecimento clássico da urina (**colúria**).\n\n**Próximo Passo:** Solicitar sorologias virais (HBsAg, anti-HBc IgM, anti-HCV, anti-HAV IgM) e manter suporte, observando função hepática fulminante através de INR.'
  }
];

