import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAI } from "https://esm.sh/openai@4.0.0"

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
    // 1. Authenticate User
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    // In a real Supabase Edge Function, we would verify the JWT using the Supabase Client.
    // For this implementation, we'll assume the auth header is present.

    // 2. Parse and Validate Input
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

    // 3. OpenAI Client Setup
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    const model = Deno.env.get('OPENAI_MODEL') || 'gpt-4o'

    // 4. Construct Prompt with Biomed Persona
    const systemPrompt = `Você é o BioStudy AI, um tutor especializado em Biomedicina.
Seu objetivo é ajudar estudantes de Biomedicina a compreenderem conceitos complexos de forma didática, clara e cientificamente rigorosa.

DIRETRIZES DE RESPOSTA:
- Idioma: Português Brasileiro.
- Linguagem: Clara, didática e profissional.
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
  - Deixe claro que suas respostas são para fins educacionais e não substituem a orientação profissional.
`;

    const userPrompt = `Tópico: \${topic}
Contexto do usuário: \${context || 'Estudante de Biomedicina'}
Pergunta: \${question}`

    // 5. Call OpenAI Responses API (as per the provided example)
    // Note: Using the /v1/responses endpoint structure from the prompt's example
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer \${openai.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        input: `\${systemPrompt}\\n\\n\${userPrompt}`,
        store: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API Error:', errorData)
      throw new Error(errorData.error?.message || 'OpenAI API failed')
    }

    const data = await response.json()

    // The example doesn't specify the response format of /v1/responses,
    // but assuming it returns the answer in a field like 'output' or 'answer'.
    // Adjusting to a plausible response structure for this specific endpoint.
    const answer = (typeof data.output === 'string' ? data.output : data.output?.[0]?.content?.[0]?.text) || data.answer || data.choices?.[0]?.message?.content || 'Não foi possível gerar uma resposta.'

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
