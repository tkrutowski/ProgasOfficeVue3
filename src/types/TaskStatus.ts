type Status = "ALL" | "FINISHED" | "OVER_DUE" | "NOT_FINISHED" | "NOT_FINISHED_END" | "NOT_FINISHED_TECH" ;
type StatusViewName = "Wszystkie" | "Zrealizowane" | "Niezrealizowane" | "Przeterminowane" | "Odbiór techniczny" | "Odbiór końcowy" ;
export interface TaskStatus {
    name: Status;
    viewName: StatusViewName;
}