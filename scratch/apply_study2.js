const fs = require('fs');
let code = fs.readFileSync('src/screens/Study/StudyScreen.jsx', 'utf8');

// 1. imports
code = code.replace(
  'import { fetchDisciplinesWithProgress, fetchFlashcards, updateFlashcardProgress, fetchQuestions, saveQuestionAttempt } from \\"../../services/supabaseService\\";',
  'import { fetchDisciplinesWithProgress, fetchFlashcards, updateFlashcardProgress, fetchQuestions, saveQuestionAttempt, ensureFlashcardExists, saveStudySession } from \\"../../services/supabaseService\\";\\nimport * as content from \\"../../services/contentService\\";'
);

// 2. State
code = code.replace(
  'const [currentIndex, setCurrentIndex] = useState(0);',
  'const [currentIndex, setCurrentIndex] = useState(0);\\n  const [topics, setTopics] = useState([]);\\n  const [selectedTopic, setSelectedTopic] = useState(null);\\n  const [sessionAnswers, setSessionAnswers] = useState([]);'
);

// 3. handleFlashcardEval
code = code.replace(
  /const handleFlashcardEval = async \(evaluation\) => \{[\s\S]*?\} catch \(err\) \{[\s\S]*?\}\n  \};/,
  \const handleFlashcardEval = async (evaluation) => {
    const card = items[currentIndex];
    try {
      await ensureFlashcardExists(card);
      await updateFlashcardProgress(user.id, card.id, evaluation);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setStep(\\"finished\\");
        setTimerActive(false);
      }
    } catch (err) {
      console.error(\\"Error saving flashcard progress:\\", err);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setStep(\\"finished\\");
        setTimerActive(false);
      }
    }
  };\)

// 4. handleQuestionAnswer
code = code.replace(
  /const handleQuestionAnswer = async \(option\) => \{[\s\S]*?\} catch \(err\) \{\n\s*console.error\(\"Error saving attempt:\", err\);\n\s*\}\n\s*\}\n\s*\};/,
  \const handleQuestionAnswer = async (option) => {
    if (answeredOption) return;

    const question = items[currentIndex];
    setAnsweredOption(option);

    if (mode === \\"prova\\") {
      setExamAnswers(prev => [...prev, { questionId: question.id, selected: option }]);
    } else {
      try {
        await saveQuestionAttempt(user.id, question, option);
      } catch (err) {
        console.error(\\"Error saving attempt:\\", err);
      }
      setSessionAnswers(prev => [...prev, { questionId: question.id, topicId: question.topic_id, selected: option, correct: option === question.correct_option }]);
    }
  };\)


// 5. startStudying
code = code.replace(
  /const startStudying = async \(disc\) => \{[\s\S]*?setLoading\(false\);\n  \};/,
  \const startStudying = async (disc, topicId = null) => {
    setLoading(true);
    setErrorMsg(\\"\\");
    setSelectedTopic(topicId);
    try {
      const data = mode === \\"flashcards\\"
        ? await fetchFlashcards(disc.id, topicId)
        : await fetchQuestions(disc.id, topicId, mode === \\"simulado\\", mode === \\"simulado\\" ? 15 : null);
      
      if (!data || data.length === 0) {
        setErrorMsg(\\\Nenhum(a) \ encontrado(a).\\\);
        setLoading(false);
        return;
      }
      
      setItems(data);
      setCurrentIndex(0);
      setAnsweredOption(null);
      setExamAnswers([]);
      setSessionAnswers([]);
      setStep(\\"studying\\");
      if (mode === \\"prova\\") {
        setTimeLeft(600); // 10 mins
        setTimerActive(true);
      }
    } catch (err) {
      console.error(\\"Error loading study items:\\", err);
      setErrorMsg(\\"Erro ao carregar os itens.\\");
    }
    setLoading(false);
  };\)

// 6. onClick for disciplines
code = code.replace(
  /onClick=\{\(\) => startStudying\(d\)\}/g,
  'onClick={() => { setSelectedDisc(d); setTopics(content.getTopicsByDiscipline(d.id)); setStep(\\"topic-selection\\"); }}'
)

// 7. Insert topic-selection step
const topicSelectionCode = \
  if (step === \\"topic-selection\\") {
    return (
      <div style={{ padding: \\"20px 16px 90px\\" }}>
        <div style={{ display: \\"flex\\", alignItems: \\"center\\", gap: 8, marginBottom: 16 }}>
          <button onClick={() => setStep(\\"disc-selection\\")} style={{ background: \\"none\\", border: \\"none\\", color: theme.textSecondary, cursor: \\"pointer\\", display: \\"flex\\", alignItems: \\"center\\", gap: 6, fontSize: 13 }}>
            <ChevronLeft size={16} /> Voltar
          </button>
          <h1 className=\\"bs-display\\" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Selecione o Assunto</h1>
        </div>
        <p style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6, lineHeight: 1.5 }}>
          Escolha um tópico específico ou revise todos os assuntos.
        </p>

        <div style={{ display: \\"flex\\", flexDirection: \\"column\\", gap: 10, marginTop: 24 }}>
          <Card padding={16} onClick={() => startStudying(selectedDisc, null)} style={{ cursor: \\"pointer\\", transition: \\"transform 0.2s\\" }}>
            <span style={{ fontWeight: 600, color: theme.text }}>Todos os assuntos</span>
          </Card>
          {topics.map((t) => (
            <Card key={t.id} padding={16} onClick={() => startStudying(selectedDisc, t.id)} style={{ cursor: \\"pointer\\", transition: \\"transform 0.2s\\" }}>
              <span style={{ fontWeight: 600, color: theme.text }}>{t.title}</span>
            </Card>
          ))}
        </div>
        {loading && <EmptyState icon={Brain} title=\\"Carregando itens...\\" desc=\\"Aguarde um momento.\\" />}
        {errorMsg && (
          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: alpha(theme.danger, '22'), border: \\\1px solid \\\\, color: theme.danger, textAlign: \\"center\\", fontSize: 13, fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}
      </div>
    );
  }

  if (step === \\"studying\\") {\;
code = code.replace('  if (step === \\"studying\\") {', topicSelectionCode);


// 8. Finished Step
code = code.replace(
  /if \(step === \\"finished\\"\) \{[\s\S]*?return null;\n\}/,
  \if (step === \\"finished\\") {
    if (mode !== \\"flashcards\\") {
      const isProva = mode === \\"prova\\";
      let correct = 0;
      
      if (isProva) {
        items.forEach((q, idx) => {
          const answer = examAnswers[idx]?.selected;
          if (answer === q.correct_option) correct++;
        });
        
        useEffect(() => {
          const saveProva = async () => {
            try {
              await Promise.all(items.map((q, idx) => {
                const opt = examAnswers[idx]?.selected;
                if (opt) return saveQuestionAttempt(user.id, q, opt).catch(e => console.error(e));
                return Promise.resolve();
              }));
              
              await saveStudySession({
                user_id: user.id,
                discipline_id: selectedDisc?.id,
                topic_id: selectedTopic,
                mode: mode,
                score_percent: Math.round((correct / items.length) * 100),
                correct_count: correct,
                total_count: items.length,
                duration_seconds: 600 - timeLeft
              });
            } catch(e) {
              console.error(\\"Error saving exam:\\", e);
            }
          };
          saveProva();
        }, []); 
      } else {
        correct = sessionAnswers.filter(a => a.correct).length;
      }

      const percent = Math.round((correct / items.length) * 100);

      let status = \\"PRECISA REFORÇO\\";
      let statusColor = theme.danger;
      if (percent >= 80) { status = \\"DOMINADO\\"; statusColor = theme.primary; }
      else if (percent >= 60) { status = \\"REVISAR\\"; statusColor = theme.secondary; }

      const timeTaken = isProva ? (600 - timeLeft) : null;
      const mins = isProva ? Math.floor(timeTaken / 60) : 0;
      const secs = isProva ? timeTaken % 60 : 0;
      
      const topicStats = {};
      sessionAnswers.forEach(ans => {
        if (!topicStats[ans.topicId]) topicStats[ans.topicId] = { total: 0, correct: 0, name: topics.find(t => t.id === ans.topicId)?.title || 'Tópico' };
        topicStats[ans.topicId].total++;
        if (ans.correct) topicStats[ans.topicId].correct++;
      });

      return (
        <div style={{ padding: \\"20px 16px 90px\\", height: \\"100%\\", display: \\"flex\\", flexDirection: \\"column\\", alignItems: \\"center\\", justifyContent: \\"flex-start\\", overflowY: \\"auto\\", textAlign: \\"center\\" }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: alpha(statusColor, '20'), display: \\"flex\\", alignItems: \\"center\\", justifyContent: \\"center\\", margin: \\"20px auto 20px\\" }}>
            <Trophy size={40} color={statusColor} />
          </div>
          <h1 className=\\"bs-display\\" style={{ fontSize: 32, fontWeight: 700, color: theme.text, margin: 0 }}>{percent}%</h1>
          <div style={{ fontSize: 18, fontWeight: 600, color: statusColor, marginTop: 8 }}>{status}</div>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4, marginBottom: 24 }}>
            Você acertou {correct} de {items.length} questões.
            {isProva && <><br />Tempo: {mins}m {secs}s</>}
          </div>

          <Card padding={20} style={{ background: theme.surface, border: \\\1px solid \\\\, marginBottom: 24, width: \\"100%\\", maxWidth: 400 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 12 }}>Análise da Sessão</div>
            <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.5, textAlign: \\"left\\" }}>
              {percent < 80 ?
                \\"Ainda existem lacunas no seu conhecimento. Recomendamos revisar os tópicos onde houve erro antes de avançar.\\" :
                \\"Excelente desempenho! Você demonstra domínio sólido sobre este conteúdo.\\"}
            </div>
            
            {!isProva && Object.keys(topicStats).length > 0 && (
              <div style={{ marginTop: 16, textAlign: \\"left\\" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.textSecondary, marginBottom: 8, textTransform: \\"uppercase\\" }}>Desempenho por Assunto</div>
                {Object.values(topicStats).map((st, i) => {
                  const p = Math.round((st.correct / st.total) * 100);
                  const isGood = p >= 70;
                  return (
                    <div key={i} style={{ display: \\"flex\\", justifyContent: \\"space-between\\", alignItems: \\"center\\", marginBottom: 8, padding: \\"8px 0\\", borderBottom: \\\1px solid \\\\ }}>
                      <div style={{ fontSize: 13, color: theme.text }}>{st.name}</div>
                      <Badge tone={isGood ? \\"success\\" : \\"critical\\"}>{p}%</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <button
            onClick={() => setStep(\\"mode-selection\\")}
            style={{ padding: \\"12px 24px\\", borderRadius: 12, background: theme.primary, color: theme.bg, border: \\"none\\", fontWeight: 700, cursor: \\"pointer\\", display: \\"flex\\", alignItems: \\"center\\", gap: 8, marginBottom: 20 }}
          >
            <RotateCcw size={18} /> Tentar Novamente
          </button>
        </div>
      );
    }

    return (
      <div style={{ padding: \\"20px 16px 90px\\", height: \\"100%\\", display: \\"flex\\", flexDirection: \\"column\\", alignItems: \\"center\\", justifyContent: \\"center\\", textAlign: \\"center\\" }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: theme.primary, display: \\"flex\\", alignItems: \\"center\\", justifyContent: \\"center\\", marginBottom: 20 }}>
          <CheckCircle size={32} color={theme.bg} />
        </div>
        <h1 className=\\"bs-display\\" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Revisão Concluída!</h1>
        <p style={{ fontSize: 14, color: theme.textSecondary, marginTop: 8, marginBottom: 24 }}>
          Você completou todos os {mode === \\"flashcards\\" ? \\"flashcards\\" : \\"questões\\"} de {selectedDisc?.name}.
        </p>
        <button
          onClick={() => setStep(\\"mode-selection\\")}
          style={{ padding: \\"12px 24px\\", borderRadius: 12, background: theme.primary, color: theme.bg, border: \\"none\\", fontWeight: 700, cursor: \\"pointer\\", display: \\"flex\\", alignItems: \\"center\\", gap: 8 }}
        >
          <RotateCcw size={18} /> Estudar outra disciplina
        </button>
      </div>
    );
  }

  return null;
}\
)

fs.writeFileSync('src/screens/Study/StudyScreen.jsx', code, 'utf8');
