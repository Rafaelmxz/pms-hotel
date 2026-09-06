import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TODAY } from "@/mocks/hotelData";
import { AnnualChart } from "./AnnualChart";
import { KpiCards } from "./KpiCards";

export function DashboardPage() {
  const monthLabel = format(TODAY, "MMMM yyyy", { locale: ptBR });

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Painel operacional
        </p>
        <h1 className="font-display mt-1 text-3xl font-medium tracking-tight capitalize sm:text-4xl">
          {monthLabel}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Ocupação, movimento do dia e receita do mês — dados de demonstração do Hotel Aurora
          (PMS v1.0).
        </p>
      </div>
      <KpiCards />
      <AnnualChart />
    </div>
  );
}
