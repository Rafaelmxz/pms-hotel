import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TODAY, type Reservation } from "@/mocks/hotelData";
import { ReservationDrawer } from "./ReservationDrawer";
import { Timeline, VISIBLE_DAYS } from "./Timeline";
import { STATUS_LABEL } from "./status";

const LEGEND = ["pendente", "confirmada", "check-in", "cancelada"] as const;

const LEGEND_DOT: Record<(typeof LEGEND)[number], string> = {
  pendente: "bg-status-pending",
  confirmada: "bg-status-confirmed",
  "check-in": "bg-status-checkin",
  cancelada: "bg-status-cancelled",
};

export function CalendarPage() {
  const [start, setStart] = useState(() => addDays(TODAY, -3));
  const [selected, setSelected] = useState<Reservation | null>(null);

  const rangeLabel = useMemo(() => {
    const end = addDays(start, VISIBLE_DAYS - 1);
    const startText = format(start, "d MMM", { locale: ptBR });
    const endText = format(end, "d MMM yyyy", { locale: ptBR });
    return `${startText} – ${endText}`;
  }, [start]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Mapa de hospedagem
          </p>
          <h1 className="font-display mt-1 text-3xl font-medium tracking-tight sm:text-4xl">
            Calendário
          </h1>
          <p className="mt-2 text-sm text-muted-foreground capitalize">{rangeLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Semana anterior"
            onClick={() => setStart((current) => addDays(current, -7))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" onClick={() => setStart(addDays(TODAY, -3))}>
            Hoje
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Próxima semana"
            onClick={() => setStart((current) => addDays(current, 7))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {LEGEND.map((status) => (
          <li key={status} className="inline-flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${LEGEND_DOT[status]}`} />
            {STATUS_LABEL[status]}
          </li>
        ))}
      </ul>

      <Timeline start={start} onSelect={setSelected} />
      <ReservationDrawer
        reservation={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
