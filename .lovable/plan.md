## Objetivo

Tornar a "Tabela resumo das 6 categorias" em `/comparativo-planilha-vs-software` legível no celular sem zoom, mantendo a tabela atual em telas médias e maiores.

## Abordagem

Renderização condicional por breakpoint, usando o mesmo array `tabelaResumo` (sem duplicar dados):

- **Mobile (`<md`)** — lista de cartões empilhados, um por categoria. Cada cartão mostra:
  - Título da categoria (destaque)
  - Linha "Planilha manual" com ícone ✗ e o texto curto
  - Linha "BoiControl" com ícone ✓ e o texto curto
  - Nota em texto menor no rodapé do cartão
- **Tablet/Desktop (`md+`)** — mantém a tabela atual (`<Table>` do shadcn) sem mudanças visuais.

Implementação: dois blocos irmãos na mesma seção, alternados com `block md:hidden` e `hidden md:block`. Mantém o `<h2>` e o parágrafo introdutórios já existentes.

## Arquivos afetados

- `src/pages/ComparativoPlanilhaVsSoftware.tsx` — única alteração: substituir o bloco da tabela atual pela versão responsiva (cards no mobile + tabela no desktop).

Sem novas dependências, sem mudanças em rotas, sitemap ou SEO.
