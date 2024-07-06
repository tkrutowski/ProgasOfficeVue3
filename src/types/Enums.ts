type ByOwnership = "ALL" | "MINE" | "COMPANY" ;
type ByOwnershipViewName = "Wszystkie" | "Tylko moje" | "Progas" ;
export interface DisplayByOwnershipEnum {
    name: ByOwnership;
    viewName: ByOwnershipViewName;
}

type status = "ALL" | "ACTIVE" | "INACTIVE" ;
export interface ActiveStatus {
    name: status;
    viewName: string;
}