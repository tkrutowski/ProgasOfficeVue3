import {Customer} from "@/types/Customer.ts";
import {Designer, DesignerTraffic} from "@/types/Designer.ts";
import {Coordinator} from "@/types/Coordinator.ts";
import {Address} from "@/types/Address.ts";
import {Surveyor} from "@/types/Surveyor.ts";
import {UtilityCompanyType} from "@/types/Commons.ts";
import {Plot} from "@/types/Plot.ts";
import {WorkRangeGasConnection, WorkRangeGasStation} from "@/types/WorkRange.ts";
import {TaskType} from "@/types/TaskType.ts";

export interface GasConnection {
    idTask: number;
    designer: Designer | undefined;
    coordinator: Coordinator | undefined;
    customer: Customer | undefined;
    address: Address | undefined;
    plots: Plot[];
    workRangeGasConnections: WorkRangeGasConnection[];
    workRangeGasStations: WorkRangeGasStation[];
    pgn: Pgn;

    taskNo: string;
    contractNo: string;
    contractDate: undefined | Date;
    conditionNo: string;
    conditionDate: undefined | Date;
    substationName: string;//todo zrobić enum
    connectionAgreementNumber: string;
    sapUpNo: string;
    accelerationDate: undefined | Date;

    taskValue: number;
    finishDeadline: undefined | Date;
    projectDeadline: undefined | Date;
    projectValue: number;
    wsgFinalPickupDate: undefined | Date;
    constructionValue: number;
    isPGN: boolean;
    info: string;
    isFinished: boolean;
    idGasConnectionSync: boolean;
    stage: string | number;
    gasConnectionDesign: GasConnectionDesign;
    gasConnectionBuild: GasConnectionBuild;
}

export interface GasConnectionDesign {
    //stage 1
    projectOrderSubmissionDate: undefined | Date;
    projectOrderConfirmationDate: undefined | Date;
    proxySubmissionDate: undefined | Date;
    proxyReceiptDate: undefined | Date;
    mapSubmissionDate: undefined | Date ;
    mapReceiptDate: undefined | Date;
    mapDeliveredBy: number;
    mapSurveyor: Surveyor | null;
    extractSubmissionDate: undefined | Date;
    extractReceiptDate: undefined | Date;

    //stage 2
    withoutZud:boolean;
    zudpSubmissionDate: undefined | Date;
    zudpReceiptDate: undefined | Date;
    utilityCompanyType:UtilityCompanyType | null;
    utilityCompanySubmissionDate: undefined | Date;
    utilityCompanyReceiptDate: undefined | Date;

    //stage 3
    wsgAgreementSubmissionDate: undefined | Date;
    wsgAgreementReceiptDate: undefined | Date;
    wsgAgreementAgreementDate: undefined | Date;
    wsgAgreementNo: string;
    wsgAgreementPointSchemeSubmissionDate: undefined | Date;
    wsgAgreementPointSchemeReceiptDate: undefined | Date;

    //stage 4
    withoutTrafficOrganizationProject:boolean;
    trafficOrganizationProjectSubmissionDate: undefined | Date;
    trafficOrganizationProjectReceiptDate: undefined | Date;
    designerTraffic: DesignerTraffic | null;
    gasPointOrderDate: undefined | Date;
    gasPointPickupDate: undefined | Date;
    gasPointDocPickupDate: undefined | Date;
    gasPointOrderNo: string;
    zudpSentToSurveyorDate: undefined | Date;
    surveyorTrafficProject: Surveyor | null;
}

export interface GasConnectionBuild {
    substationNotificationSubmissionDate: undefined | Date;
    surveyingSketchesDate: undefined | Date;
    surveyingInventoryDate: undefined | Date;
    realizationStartDate: undefined | Date;
    realizationEndDate: undefined | Date;
    wsgTechnicalAcceptanceDate: undefined | Date;
    wsgFinalAcceptanceSubmissionDate: undefined | Date;
    wsgFinalAcceptanceDate: undefined | Date;
    gasConnectionRealLength: number;
    technicalAcceptanceProtocolNo: string;
    gasPipelineInventoryNumber: string;
    wsgInfo: string;
}

export interface Pgn {
    id: number;
    idTask: number;
    pgnNumber: string;
    applicationNumber: string;
    recipient: string;
    workDate: undefined | Date;
    info: string;
    taskType: TaskType;
}