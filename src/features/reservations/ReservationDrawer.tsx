import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  formatCurrency,
  formatStayRange,
  roomById,
  stayNights,
  type Reservation,
} from "@/mocks/hotelData";
import { STATUS_BADGE, STATUS_LABEL } from "./status";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

export function ReservationDrawer({
  reservation,
  onOpenChange,
}: {
  reservation: Reservation | null;
  onOpenChange: (open: boolean) => void;
}) {
  const room = reservation ? roomById(reservation.roomId) : undefined;
  const nights = reservation
    ? stayNights(reservation.checkIn, reservation.checkOut)
    : 0;

  return (
    <Sheet open={Boolean(reservation)} onOpenChange={onOpenChange}>
      <SheetContent>
        {reservation ? (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_BADGE[reservation.status]}>
                  {STATUS_LABEL[reservation.status]}
                </Badge>
                {room ? (
                  <span className="text-xs text-muted-foreground">
                    Quarto {room.number} · {room.type}
                  </span>
                ) : null}
              </div>
              <SheetTitle>{reservation.guestName}</SheetTitle>
              <SheetDescription>{reservation.guestEmail}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-6">
              <dl>
                <Field
                  label="Período"
                  value={formatStayRange(reservation.checkIn, reservation.checkOut)}
                />
                <Field
                  label="Check-in"
                  value={format(new Date(reservation.checkIn + "T12:00:00"), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                />
                <Field
                  label="Check-out"
                  value={format(new Date(reservation.checkOut + "T12:00:00"), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                />
                <Field
                  label="Noites"
                  value={`${nights} ${nights === 1 ? "noite" : "noites"}`}
                />
                <Field label="Hóspedes" value={String(reservation.guests)} />
                <Field label="Origem" value={reservation.origin} />
              </dl>
              <Separator className="my-3" />
              <dl>
                <Field label="Diária" value={formatCurrency(reservation.nightlyRate)} />
                <Field label="Valor total" value={formatCurrency(reservation.totalAmount)} />
              </dl>
              {reservation.notes ? (
                <>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Observações
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{reservation.notes}</p>
                  </div>
                </>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
