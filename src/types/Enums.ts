type CustomColor = "SUBMISSION" | "RECEIPT" | "EMPTY";
export default CustomColor;

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

type stage = "LACK" | "YELLOW" | "GREEN" ;
export interface StageType {
    name: stage;
    value: number;
}

