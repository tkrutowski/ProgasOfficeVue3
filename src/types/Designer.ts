import {ActiveStatus} from "@/types/Enums.ts";

export interface Designer {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    phone2: string;
    mail: string;
    info: string;
    city: string;
    street: string;
    zip: string;
    status: ActiveStatus;
    employee: boolean;
}