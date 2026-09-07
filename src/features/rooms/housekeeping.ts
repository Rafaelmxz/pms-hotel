export type HousekeepingStatus = "limpo" | "sujo" | "manutencao";

export const HOUSEKEEPING_ORDER: HousekeepingStatus[] = [
  "limpo",
  "sujo",
  "manutencao",
];

export const HOUSEKEEPING_LABEL: Record<HousekeepingStatus, string> = {
  limpo: "Limpo",
  sujo: "Sujo",
  manutencao: "Em manutenção",
};

export const HOUSEKEEPING_DOT: Record<HousekeepingStatus, string> = {
  limpo: "bg-status-confirmed",
  sujo: "bg-status-pending",
  manutencao: "bg-status-cancelled",
};
