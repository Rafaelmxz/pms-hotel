# Changelog — PMS Hotel Aurora

## [1.3.0] — 2026-09-06

Marco da branch `feature/novo-mapa-e-dashboard`.

### Mapa de Reservas
- Grade agrupada por categoria (Standard, Luxo, Suíte)
- Barras contínuas com nome do hóspede e status
- Destaque de hoje, canceladas discretas, empty state
- Sidebar sticky e drawer de detalhes
- Memoização da grade (`useMemo` / `React.memo`)

### Painel
- Cards de movimento do dia e receita do mês
- Gráfico anual (receita + ocupação)

### Estrutura
- Organização por domínio: `src/features/dashboard`, `src/features/reservations`, `src/mocks`
- Error Boundary nas telas
- Frontend-only, dados fictícios, sem backend
