
export interface ColumnView {
    sortIndex: number,
    visible: boolean,
    frozen: boolean,
    options: string,
    type: string,
    showFilterMatchModes: boolean,
    field: string,
    header: string,
    dataType: string
}

export interface GasConnectionSettings {
    gasConnectionColumns: ColumnView[],
    sortColumn:string | undefined,
    sortDirection:boolean,
    rowsNumber:number,
    displayStatus:string,
    colorBeforeDeadline: string,
    daysBefore: number,
    daysBeforeProjectDeadlineDashboard: number,
    daysBeforeFinishDeadlineDashboard: number,
    colorCompleted: string,
    colorOverdue: string,
    colorSubmission: string,
    colorReceipt: string,
    colorFvReady: string,
    displayByDesigner: string
}

export interface AppSettings {
    userId: number,
    gasConnectionSettings: GasConnectionSettings
}