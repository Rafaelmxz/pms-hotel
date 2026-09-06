# PMS Hotel Aurora — versão 1.0

Protótipo frontend de **sistema de gestão hoteleira (PMS)** para avaliação de interface.

## O que inclui

- **Painel (`/`)**  
  - Cards: quartos ocupados/livres, check-ins/check-outs do dia, receita prevista e recebida do mês  
  - Gráfico anual (Recharts ComposedChart): receita (barras) + taxa de ocupação (linha)

- **Calendário Timeline (`/calendario`)**  
  - Mapa de hospedagem (21 dias × 10 quartos)  
  - Barras por status: pendente, confirmada, check-in, cancelada  
  - Sidebar fixa com número e tipo do quarto  
  - Drawer de detalhes da reserva ao clicar

## Stack

- React 19 + TypeScript + Vite  
- Tailwind CSS v4  
- Recharts  
- date-fns  
- Radix UI (Sheet/Dialog)  
- Lucide icons  

## Dados

100% fictícios em `src/mocks/hotelData.ts` (Hotel Aurora, 10 quartos, reservas geradas com ocupação anual entre ~40% e ~85%). Sem backend e sem API externa.

## Como rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Versão

**1.0.0** — backup da interface de demonstração (Dashboard + Calendário).

## Licença

Uso interno / demonstração.
