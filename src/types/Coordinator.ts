import {ActiveStatus} from "@/types/Enums.ts";

export interface Coordinator {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    phone2: string;
    mail: string;
    info: string;
    status: ActiveStatus;
}