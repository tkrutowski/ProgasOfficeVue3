import {ActiveStatus} from "@/types/Enums.ts";

export interface Customer {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    phone2: string;
    mail: string;
    info: string;
    //TODO zmienic na address?
    city: string;
    street: string;
    zip: string;
    status: ActiveStatus;
    employee: boolean;
}