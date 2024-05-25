type ByDesigners = "ALL" | "MINE" | "COMPANY" ;
type ByDesignersViewName = "Wszystkie" | "Tylko moje" | "Progas" ;
export interface DisplayByDesignersEnum {
    name: ByDesigners;
    viewName: ByDesignersViewName;
}

type status = "ALL" | "ACTIVE" | "INACTIVE" ;
export interface ActiveStatus {
    name: status;
    viewName: string;
}