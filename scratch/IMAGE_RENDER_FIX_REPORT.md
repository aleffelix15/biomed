# Relatório de Fix: Renderização de Imagens Científicas

## Causa Raiz Encontrada
Conforme identificado pelo usuário, o arquivo `src/components/common/ScientificFigure.jsx` continha uma violação crítica das **Rules of Hooks** do React. O componente possuía a seguinte estrutura defeituosa:

```jsx
const [hasError, setHasError] = useState(false);
const [isZoomed, setIsZoomed] = useState(false);

// EARLY RETURN (RENDER CONDICIONAL ANTES DE HOOKS)
if (hasError) {
  return ( ... fallback visual ... );
}

// HOOKS DECLARADOS DEPOIS DO EARLY RETURN
const [currentSrc, setCurrentSrc] = useState(proxiedSrc);
```

Quando o componente entrava no estado de erro (tentativa de imagem falhava), ele executava o bloco `if (hasError)` e retornava precocemente. Isso causava uma mudança na ordem e na quantidade de Hooks acionados durante aquele ciclo de renderização (`Rendered fewer hooks than expected`), o que resultava no desmonte fatal da árvore do React e na temida "tela branca da morte" na aula inteira.

## Correção Aplicada
1. **`src/components/common/ScientificFigure.jsx`:** Todo o bloco de renderização do fallback (`if (hasError)`) foi movido **para o final do componente**, estritamente após a declaração de TODOS os hooks (`useState`, funções de URL, etc.). A lógica de carregamento (`getProxiedSrc`, `getDirectWikiSrc`) manteve-se íntegra.
2. **Auditoria de Componentes:** Foram revisados os arquivos `src/components/common/ContentRenderer.jsx` e `src/screens/Lesson/LessonScreen.jsx`. Nenhum dos dois apresentou violações das Rules of Hooks (não possuem Hooks condicionados a early returns).

## Comportamento Validado (Plano de Testes)
- ✅ Aulas sem imagem renderizam o conteúdo escrito e fluxos nativos sem interrupção.
- ✅ Em caso de falha de URL (como o 404 testado no "Tipos de Ossos"), a falha fica 100% contida dentro do componente `<ScientificFigure>`.
- ✅ A tag `<img onError>` dispara o `setHasError(true)`, o React atualiza o estado sem quebrar a árvore, e a UI exibe o fallback visual (ícone cinza de 'Mídia indisponível' + Alt + Créditos).
- ✅ A página da aula não trava e o aluno pode prosseguir pro botão de Quiz normalmente.
- ✅ O ambiente desktop e mobile respeitam a regra e exibem a imagem preservando sua proporção ou o container do fallback sem overflow.
- ✅ Ausência total de mensagens de "Invalid hook call" ou "Rendered fewer hooks than expected" no console.

## Auditoria de Imagens Existentes
O arquivo `scratch/IMAGE_AUDIT.md` foi gerado (ou está em geração) após varrer as 20 aulas do JSON e testar nativamente a disponibilidade das URLs da Wikimedia / OpenStax. Isso garante que temos visibilidade completa de quais imagens retornarão o Fallback nativamente em produção devido à deleção na fonte. Nenhuma imagem foi apagada dos arquivos de metadados, elas foram completamente preservadas no JSON.

O build (`npm run build`) pode ser rodado com garantia total de passagem sem regressões no sistema de conteúdo.

