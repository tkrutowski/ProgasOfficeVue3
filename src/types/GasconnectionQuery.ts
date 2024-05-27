export interface GasconnectionQuery {
    idTask: number;
    designerFullName: string;
    coordinatorFullName: string;
    customerFullName: string;
    commune: string;
    city: string;
    street: string;
    taskNo: string;
    conditionNo: string;
    contractNo: string;
    contractDate: string | Date;
    finishDeadline: string | Date;
    customerPhone: string;
    isFinished: boolean;
    isPGN: boolean;
    mapSubmissionDate: string | Date;
    mapReceiptDate: string | Date;
    extractSubmissionDate: string | Date;
    extractReceiptDate: string | Date;
    zupdSubmissionDate: string | Date;
    zudpReceiptDate: string | Date;
    utilityCompanySubmissionDate: string | Date;
    utilityCompanyReceiptDate: string | Date;
    agreementSubmissionDate: string | Date;
    agreementReceiptDate: string | Date;
    substationNotificationSubmissionDate: string | Date;
    realizationStartDate: string | Date;
    realizationEndDate: string | Date;
    surveyingSketchesDate: string | Date;
    surveyingInventoryDate: string | Date;
    wsgTechnicalAcceptanceDate: string | Date;
    projectValue: number;
    constructionValue: number;
    taskValue: number;
    projectDeadline: string | Date;
    projectOrderSubmissionDate: string | Date;
    projectOrderConfirmationDate: string | Date;
    proxySubmissionDate: string | Date;
    proxyReceiptDate: string | Date;
    mapProvidedBy: number;
    zudpSentToSurveyorDate: string | Date;
    trafficOrganizationProjectSubmissionDate: string | Date;
    trafficOrganizationProjectReceiptDate: string | Date;
    wsgFinalAcceptanceDate: string | Date;
    connectionAgreementNumber: string;
    sapUpNo: string;
    scopeConnection: string;
    scopeStation: string;
    scopeStationAmount: number;
    scopeGasConnection: string;
    scopeGasConnectionAmount: number;
    cabinetProvidedBy: string;
    cabinetProvidedByDate: string | Date;
    taskCalendarDate: string | Date;
    substationName: string;
    gasInternalId: number;
    gasInternalNo: string;
    idDesigner: number;
    isInvoice: boolean;
    stage: number;
    wsgFinalAcceptanceSubmissionDate: string | Date;
    withoutTrafficOrganizationProject: boolean;
    accelerationDate: string | Date;
}