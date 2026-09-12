import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const { topic, question, context } = await req.json()

    if (!question || !topic) {
      return new Response(
        JSON.stringify({ success: false, error: 'Topic and question are required.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (question.length > 1000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Question is too long.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-3.6-flash'

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing.')
    }

    const systemPrompt = `Você é o BioStudy AI, um tutor especializado em Biomedicina.
Seu objetivo é ajudar estudantes de Biomedicina a compreenderem conceitos complexos de forma didática, clara e cientificamente rigorosa.

DIRETRIZES DE RESPOSTA:
- Idioma: Português Brasileiro.
- Linguagem: Clara, didática e profissional.
- Formatação Matemática: NÃO utilize notação LaTeX (como $...$ ou $$...$$) para fórmulas. Escreva tudo em texto puro (ex: 'menor que 100 mg/dL' em vez de '$< 100\\text{ mg/dL}$').
- Estrutura:
  1. Explicação direta do conceito.
  2. Desenvolvimento com exemplos e analogias se apropriado.
  3. Aplicações clínicas relevantes para a Biomedicina.
  4. Resumo final em tópicos.
- Rigor: NÃO invente referências, dados científicos ou informações clínicas.
- Segurança:
  - Se houver incerteza, declare explicitamente.
  - NÃO forneça diagnósticos médicos.
  - NÃO prescreva medicamentos ou tratamentos.
  - Deixe claro que suas respostas são para fins educacionais e não substituem a orientação profissional.`

    const userPrompt = `Tópico: ${topic}
Contexto do usuário: ${context || 'Estudante de Biomedicina'}
Pergunta: ${question}`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json()
      console.error('Gemini API Error:', errorData)
      throw new Error(errorData.error?.message || 'Gemini API failed')
    }

    const data = await geminiResponse.json()
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível gerar uma resposta.'

    return new Response(
      JSON.stringify({
        success: true,
        answer: answer,
        topic: topic,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Edge Function Error:', error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})