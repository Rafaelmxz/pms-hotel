import { addDays, format, isSameDay, isWeekend } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getReservationsOverlapping,
  parseISODate,
  rooms,
  stayNights,
  TODAY,
  type Reservation,
} from "@/mocks/hotelData";
import { cn } from "@/lib/utils";
import { STATUS_BAR, STATUS_LABEL } from "./status";

const VISIBLE_DAYS = 21;

function clampIndex(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function barPlacement(reservation: Reservation, start: Date, days: number) {
  const checkIn = parseISODate(reservation.checkIn);
  const startOffset = Math.round((checkIn.getTime() - start.getTime()) / 86_400_000);
  const nights = stayNights(reservation.checkIn, reservation.checkOut);
  const colStart = clampIndex(startOffset, 0, days);
  const colEnd = clampIndex(startOffset + nights, 0, days);
  return { colStart, colEnd, hidden: colEnd <= colStart };
}

function toKey(day: Date) {
  return format(day, "yyyy-MM-dd");
}

export function Timeline({
  start,
  onSelect,
}: {
  start: Date;
  onSelect: (reservation: Reservation) => void;
}) {
  const days = Array.from({ length: VISIBLE_DAYS }, (_, i) => addDays(start, i));
  const rangeEnd = addDays(start, VISIBLE_DAYS);
  const items = getReservationsOverlapping(start, rangeEnd);

  return (
    <div className="timeline-map min-w-0 overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
      <div className="max-h-(--timeline-max-h) overflow-auto overscroll-x-contain">
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `var(--timeline-sidebar) repeat(${VISIBLE_DAYS}, var(--timeline-day))`,
            gridTemplateRows: `var(--timeline-head) repeat(${rooms.length}, var(--timeline-row))`,
            width: `calc(var(--timeline-sidebar) + ${VISIBLE_DAYS} * var(--timeline-day))`,
          }}
        >
          <div className="sticky top-0 left-0 z-30 flex items-end bg-card px-3 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Quarto
          </div>
          {days.map((day, index) => {
            const today = isSameDay(day, TODAY);
            const weekend = isWeekend(day);
            return (
              <div
                key={toKey(day)}
                className={cn(
                  "sticky top-0 z-20 flex flex-col items-center justify-center border-l border-border bg-card",
                  weekend && "bg-weekend",
                  today && "bg-today",
                )}
                style={{ gridColumn: index + 2, gridRow: 1 }}
              >
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {format(day, "EEE", { locale: ptBR }).replace(".", "")}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex size-7 items-center justify-center rounded-full text-sm font-medium tabular-nums",
                    today && "bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
            );
          })}

          {rooms.map((room, roomIndex) => (
            <div
              key={room.id}
              className="sticky left-0 z-20 flex flex-col justify-center border-t border-border bg-card px-3"
              style={{ gridColumn: 1, gridRow: roomIndex + 2 }}
            >
              <span className="text-sm font-medium tabular-nums">{room.number}</span>
              <span className="hidden truncate text-xs whitespace-nowrap text-muted-foreground sm:block">
                {room.type}
              </span>
            </div>
          ))}

          {rooms.map((room, roomIndex) =>
            days.map((day, dayIndex) => (
              <div
                key={`${room.id}-${toKey(day)}`}
                className={cn(
                  "border-t border-l border-border",
                  isWeekend(day) && "bg-weekend/70",
                  isSameDay(day, TODAY) && "bg-today/80",
                )}
                style={{
                  gridColumn: dayIndex + 2,
                  gridRow: roomIndex + 2,
                }}
              />
            )),
          )}

          {rooms.map((room, roomIndex) => {
            const roomItems = items.filter((item) => item.roomId === room.id);
            return roomItems.map((reservation) => {
              const { colStart, colEnd, hidden } = barPlacement(
                reservation,
                start,
                VISIBLE_DAYS,
              );
              if (hidden) return null;
              return (
                <button
                  key={reservation.id}
                  type="button"
                  onClick={() => onSelect(reservation)}
                  className={cn(
                    "z-10 mx-1 my-1.5 truncate rounded-md px-2 text-left text-xs font-medium shadow-sm",
                    STATUS_BAR[reservation.status],
                  )}
                  style={{
                    gridColumn: `${colStart + 2} / ${colEnd + 2}`,
                    gridRow: roomIndex + 2,
                  }}
                  title={`${reservation.guestName} · ${STATUS_LABEL[reservation.status]}`}
                >
                  <span className="block truncate">{reservation.guestName}</span>
                </button>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}

export { VISIBLE_DAYS };
