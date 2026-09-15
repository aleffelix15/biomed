# Relatório de Investigação 3D: Viabilidade no BioStudy

Este documento consolida a investigação sobre a adição de visualização 3D de modelos anatômicos/citológicos ao aplicativo (Vite + React), sem alterar código de produção.

## 1. Bibliotecas e Impacto de Performance

O ecossistema padrão ouro hoje é o **`three.js`** com os wrappers **`@react-three/fiber`** e **`@react-three/drei`**. 

Fiz o teste em um projeto isolado carregando apenas as bibliotecas e renderizando um cubo simples com controle de órbita:

- **Impacto no Bundle:** O bundle saltou de ~45KB gzipped (React base) para impressionantes **310 KB gzipped (1.13 MB de JavaScript minificado bruto)**. 
- **Contexto:** Todo o BioStudy atual pesa ~120KB gzipped. Adicionar 3D quase triplicaria o tamanho inicial do app.
- **Solução obrigatória:** Se implementado, o módulo 3D precisa *obrigatoriamente* usar Code Splitting (`React.lazy` + `Suspense`), sendo carregado *apenas* quando o usuário abrir uma aula com 3D.
- **Performance Mobile:** O WebGL em si roda bem em celulares mid-range (60fps na maioria dos hardwares de 3-4 anos atrás). O gargalo não é o motor gráfico, mas sim a *geometria* do modelo (excesso de polígonos).

## 2. Modelos 3D Livres e Cientificamente Acurados

Imagens 2D são fáceis de achar na Wikipedia, mas o mundo 3D open-source médico é escasso. O que temos hoje:

1. **Z-Anatomy / BodyParts3D (Padrão Ouro)**
   - **Qualidade:** Excepcionalmente acurado (derivado de segmentação real de ressonâncias).
   - **Licença:** CC BY-SA (perfeitamente legal para o BioStudy educacional).
   - **Desafio:** Eles disponibilizam o arquivo num `.blend` gigantesco ou em `.obj` hiper-detalhados (milhões de polígonos, arquivos de 100MB+). 
   - **Fluxo necessário:** Para web, você não pode jogar o modelo direto. É preciso abrir no Blender, isolar o órgão (ex: coração), aplicar o modificador de "Decimate" para reduzir de 500k polígonos para ~20k, e exportar em `.glb` usando compressão *Draco*.

2. **NIH 3D Print Exchange**
   - **Qualidade:** Muito boa para vírus, moléculas, proteínas e alguns órgãos macroscópicos.
   - **Licença:** Maioria Domínio Público ou CC.
   - **Desafio:** Feito para impressão 3D (formatos STL/OBJ), não possuem textura/cor prontas, precisam de retrabalho para ficarem bonitos num app.

3. **Sketchfab (Buscando por CC)**
   - **Qualidade/Licença:** Misto. Dá pra encontrar bons modelos de universidades, mas exige curadoria intensa pra não pegar modelos anatomicamente errados gerados por curiosos.

## 3. Recomendação Final e Estimativa

**Recomendação:** 🛑 **Não vale a pena no momento atual do BioStudy.**

O benefício educacional de poder "girar um osso" é inegável em Anatomia, mas o custo operacional é brutal:
1. Adiciona ~300KB de complexidade ao bundle JavaScript.
2. Cada aula 3D vai custar uns 3-5MB de download extra do `.glb` pro usuário celular de 3G/4G.
3. Não existe "API mágica" ou repositório de onde eu possa puxar URLs de modelos `.glb` prontos para web e leves. Cada modelo precisará de um trabalho manual de curadoria, redução de polígonos no Blender, e hospedagem no Supabase Storage.

Comparado ao esforço da tarefa anterior (onde injetamos 19 lâminas/diagramas fantásticos e coloridos vindos da Wikipedia em 5 minutos a custo quase zero de performance), o 3D entrega baixo ROI (Retorno sobre Investimento) para uma versão 1.0 ou 2.0 do app.

**Estimativa caso decida prosseguir (PoC de 1 aula - Ex: Coração):**
- *Esforço:* Médio (2 a 4 horas).
- *Passos:* Instalar dependências (`npm i three @react-three/fiber @react-three/drei`), configurar carregador dinâmico de componente, baixar modelo do Z-Anatomy, otimizar com Draco no Blender, subir pro Storage, integrar com `useGLTF`.

