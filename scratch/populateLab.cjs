const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/content/laboratory/labData.js');
let fileContent = fs.readFileSync(filePath, 'utf-8');

const newItems = `
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
    ]
  },

  // --- CASOS CLÍNICOS (Utilizando o novo formato) ---
  {
    id: 'caso_anemia_ferropriva_01',
    categoryId: 'clinicalCases',
    title: 'Fadiga e Palidez em Mulher de 32 anos',
    description: 'Paciente com astenia crônica e alterações no eritrograma.',
    tags: ['Hematologia', 'Caso Clínico'],
    scenario: 'Paciente feminina, 32 anos, procurou a clínica médica queixando-se de fraqueza excessiva, sonolência, queda de cabelo e unhas quebradiças nos últimos 4 meses. Relata menstruações abundantes (hipermenorreia). \\n\\nHemograma:\\n- Eritrócitos: 3,9 milhões/mm³ (VR: 4,0 a 5,2)\\n- Hemoglobina: 9,2 g/dL (VR: 12 a 16)\\n- Hematócrito: 29% (VR: 36 a 46)\\n- VCM: 71 fL (VR: 80 a 100)\\n- HCM: 23 pg (VR: 26 a 34)\\n- RDW: 18,5% (VR: 11,5 a 14,5)\\n\\nLeucograma e Plaquetas normais. Cinética do ferro solicitada mostra Ferritina muito abaixo do normal.',
    question: 'Qual é o diagnóstico hematológico clássico suportado por este eritrograma?',
    reveal: 'Diagnóstico: Anemia Microcítica Hipocrômica, fortemente sugestiva de Anemia Ferropriva.\\n\\nRaciocínio: A Hemoglobina (9,2 g/dL) confirma a anemia. O VCM diminuído (71 fL) caracteriza a microcitose (hemácias pequenas), e o HCM diminuído (23 pg) indica hipocromia (pouca cor/pouca Hb dentro da hemácia). O RDW elevado (18,5%) evidencia anisocitose (variação de tamanho), o que é típico da anemia ferropriva carencial devido à produção irregular de hemácias pela medula conforme o estoque de ferro se esgota (ferritina baixa).'
  },
  {
    id: 'caso_itu_02',
    categoryId: 'clinicalCases',
    title: 'Disúria e Urgência Miccional',
    description: 'Alterações no EAS e bacteriúria no exame de rotina.',
    tags: ['Urinálise', 'Microbiologia'],
    scenario: 'Paciente feminina, 24 anos, apresenta dor e ardência ao urinar, associada a urgência e aumento da frequência miccional. Nega febre.\\n\\nEAS (Urina Tipo 1):\\n- Cor: Amarelo-turvo\\n- Nitrito: Positivo (+)\\n- Leucócitos (Esterase): Positivo (+++)\\n- Sedimento microscópico: > 50 leucócitos/campo; flora bacteriana abundante; hemácias 8/campo.\\n\\nUrocultura revelou crescimento > 100.000 UFC/mL em meio CLED/MacConkey.',
    question: 'A positividade simultânea da Esterase Leucocitária e do Nitrito indicam qual condição clínica provável e que grupo de agentes etiológicos?',
    reveal: 'Diagnóstico: Infecção do Trato Urinário (ITU) baixa (Cistite) de origem bacteriana.\\n\\nRaciocínio: A esterase leucocitária positiva confirma a piúria (presença massiva de leucócitos/neutrófilos) detectada também no sedimento. O Nitrito positivo é altamente indicativo de ITU causada por bactérias gram-negativas fermentadoras (da família Enterobacteriaceae, como E. coli), pois elas possuem a enzima nitrato redutase, que converte o nitrato da dieta em nitrito na urina retida na bexiga.'
  },
  {
    id: 'caso_hepatite_03',
    categoryId: 'clinicalCases',
    title: 'Icterícia e Enzimas Elevadas',
    description: 'Paciente com pele amarelada e transaminases significativamente alteradas.',
    tags: ['Bioquímica', 'Caso Clínico'],
    scenario: 'Homem de 45 anos, previamente hígido, comparece ao PS relatando náuseas, astenia e urina escura (colúria) há 1 semana. Nas últimas 48h os familiares notaram "olhos amarelados".\\n\\nBioquímica Sérica:\\n- AST (TGO): 1.450 U/L (VR: < 40)\\n- ALT (TGP): 1.890 U/L (VR: < 41)\\n- Fosfatase Alcalina: 130 U/L (VR: 40 a 129)\\n- Bilirrubina Total: 8,5 mg/dL (VR: < 1,2)\\n- Bilirrubina Direta (Conjugada): 6,1 mg/dL (VR: < 0,3)',
    question: 'Qual padrão de injúria hepática este perfil laboratorial sugere?',
    reveal: 'Diagnóstico: Lesão Hepatocelular Aguda (Padrão Hepatocítico).\\n\\nRaciocínio: O aumento astronômico de AST e ALT (em torno de 30 a 40 vezes o limite superior normal) indica que as células do fígado (hepatócitos) estão sofrendo necrose ou inflamação grave aguda, vazando essas enzimas transaminases para o sangue. A fosfatase alcalina quase normal exclui um padrão predominantemente colestático (obstrutivo). O aumento de bilirrubina direta, associado à colúria, é típico da incapacidade do fígado lesionado de excretar na bile a bilirrubina recém-conjugada, fazendo-a refluir para a corrente sanguínea (icterícia) e ser filtrada pelos rins (colúria).'
  }
`;

const insertPosition = fileContent.lastIndexOf('];');

if (insertPosition !== -1) {
  const newContent = fileContent.slice(0, insertPosition) + ',' + newItems + '\\n' + fileContent.slice(insertPosition);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log('Successfully inserted new lab items!');
} else {
  console.log('Error: Could not find closing bracket of labItems array.');
}
