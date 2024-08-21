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

export interface StageType {
    name: "LACK" | "YELLOW" | "GREEN" ;
    value: number;
}


// type stageName = "LACK" | "STAGE_1_YELLOW" | "STAGE_1_GREEN" | "STAGE_2_YELLOW" | "STAGE_2_GREEN"| "STAGE_3_YELLOW" | "STAGE_3_GREEN"| "STAGE_4_YELLOW" | "STAGE_4_GREEN";
export interface Stage {
    name: "LACK" | "STAGE_1_YELLOW" | "STAGE_1_GREEN" | "STAGE_2_YELLOW" | "STAGE_2_GREEN"| "STAGE_3_YELLOW" | "STAGE_3_GREEN"| "STAGE_4_YELLOW" | "STAGE_4_GREEN";
    value: number;
    viewValue: "" | "ETAP_1" | "ETAP_2" | "ETAP_3" | "ETAP_4";
}