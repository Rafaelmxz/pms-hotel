import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TODAY } from "@/mocks/hotelData";
import { AnnualChart } from "./AnnualChart";
import { KpiCards } from "./KpiCards";

export function DashboardPage() {
  const monthLabel = format(TODAY, "MMMM yyyy", { locale: ptBR });
  const title = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Operação
        </p>
        <h1 className="font-display mt-1 text-3xl font-medium tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Movimento do dia, ocupação e receita do mês — Hotel Aurora.
        </p>
      </div>
      <KpiCards />
      <AnnualChart />
    </div>
  );
}
