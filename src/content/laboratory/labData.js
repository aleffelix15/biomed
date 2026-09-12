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
    quiz: []
  }
];

