import {
  BedDouble,
  DoorOpen,
  LogIn,
  LogOut,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardStats, formatCurrency } from "@/mocks/hotelData";

const MOVEMENT = [
  {
    key: "occupied",
    label: "Quartos ocupados",
    value: String(dashboardStats.occupied),
    hint: `de ${dashboardStats.totalRooms} · ${dashboardStats.occupancyToday}% hoje`,
    icon: BedDouble,
  },
  {
    key: "vacant",
    label: "Quartos livres",
    value: String(dashboardStats.vacant),
    hint: "disponíveis para walk-in",
    icon: DoorOpen,
  },
  {
    key: "checkins",
    label: "Check-ins hoje",
    value: String(dashboardStats.checkInsToday),
    hint: "chegadas confirmadas",
    icon: LogIn,
  },
  {
    key: "checkouts",
    label: "Check-outs hoje",
    value: String(dashboardStats.checkOutsToday),
    hint: "saídas previstas",
    icon: LogOut,
  },
] as const;

const REVENUE = [
  {
    key: "forecast",
    label: "Receita prevista do mês",
    value: formatCurrency(dashboardStats.forecastRevenue),
    hint: "reservas ativas no mês",
    icon: TrendingUp,
  },
  {
    key: "received",
    label: "Receita recebida do mês",
    value: formatCurrency(dashboardStats.receivedRevenue),
    hint: "noites já realizadas",
    icon: Wallet,
  },
] as const;

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof BedDouble;
}) {
  return (
    <Card className="gap-3 py-4">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
        </div>
        <p className="font-display text-2xl leading-none font-medium tracking-tight tabular-nums sm:text-3xl">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export function KpiCards() {
  return (
    <div className="flex flex-col gap-5">
      <section aria-label="Movimento do dia">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Hoje
        </p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {MOVEMENT.map((card) => (
            <StatCard key={card.key} {...card} />
          ))}
        </div>
      </section>
      <section aria-label="Receita do mês">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Receita
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {REVENUE.map((card) => (
            <StatCard key={card.key} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
