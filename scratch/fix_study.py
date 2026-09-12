import re

with open('scratch/StudyScreen_new.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

topic_selection_code = r'''
  if (step === "topic-selection") {
    return (
      <div style={{ padding: "20px 16px 90px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button onClick={() => setStep("disc-selection")} style={{ background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <ChevronLeft size={16} /> Voltar
          </button>
          <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Selecione o Assunto</h1>
        </div>
        <p style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6, lineHeight: 1.5 }}>
          Escolha um tópico específico ou revise todos os assuntos.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
          <Card padding={16} onClick={() => startStudying(selectedDisc, null)} style={{ cursor: "pointer", transition: "transform 0.2s" }}>
            <span style={{ fontWeight: 600, color: theme.text }}>Todos os assuntos</span>
          </Card>
          {topics.map((t) => (
            <Card key={t.id} padding={16} onClick={() => startStudying(selectedDisc, t.id)} style={{ cursor: "pointer", transition: "transform 0.2s" }}>
              <span style={{ fontWeight: 600, color: theme.text }}>{t.title}</span>
            </Card>
          ))}
        </div>
        {loading && <EmptyState icon={Brain} title="Carregando itens..." desc="Aguarde um momento." />}
        {errorMsg && (
          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: alpha(theme.danger, '22'), border: 1px solid , color: theme.danger, textAlign: "center", fontSize: 13, fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}
      </div>
    );
  }

'''

if "topic-selection" not in code:
    code = code.replace('  if (step === "studying") {', topic_selection_code + '  if (step === "studying") {')

# Also, I need to add saveStudySession function logic. Instead of importing supabase inside useEffect, let's just create saveStudySession in supabaseService.js and import it.
# Wait, I didn't add saveStudySession to supabaseService.js yet.
# Let's fix the useEffect logic in StudyScreen_new.jsx
code = re.sub(r'const \{ createClient \} = require.*?;.*?const supabase = createClient.*?;', '', code, flags=re.DOTALL)
code = code.replace(
    "await supabase.from('study_sessions').insert({",
    "await saveStudySession({"
)

with open('scratch/StudyScreen_new.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
