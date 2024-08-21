import {TaskType} from "@/types/TaskType.ts";
import {GasCabinetProviderType} from "@/types/GasCabinetProviderType.ts";
import {GasStationType} from "@/types/GasStationType.ts";

export interface WorkRangeGasStation {
    id:number
    idTask: number;
    taskType: TaskType;
    info: string;
    capacity: number;
    amount: number;
    lengthProj: number;
    stationType: GasStationType;
}

export interface WorkRangeGasConnection {
    id:number
    idTask: number;
    taskType: TaskType;
    info: string;
    diameter: number;
    lengthWar: number;
    material: string;
    sdr: string;
    lengthProj: number;
    gasCabinetProviderType: GasCabinetProviderType;
    gasCabinetPickupDate: undefined | Date;
}