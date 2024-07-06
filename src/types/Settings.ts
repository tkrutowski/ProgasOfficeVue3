
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
    daysBeforeFinishDeadline: number,
    colorCompleted: string,
    colorOverdue: string,
    colorSubmission: string,
    colorReceipt: string,
    colorFvReady: string,
    displayByOwnership: string
    //design
    gasConnectionColumnsDesign: ColumnView[],
    daysBeforeProjectDeadline: number,
    sortColumnDesign:string | undefined,
    sortDirectionDesign:boolean,
    rowsNumberDesign:number,
    displayStatusDesign:string,
    displayByOwnershipDesign: string
}

export interface AppSettings {
    userId: number,
    gasConnectionSettings: GasConnectionSettings
}