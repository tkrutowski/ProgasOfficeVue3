import {defineStore} from "pinia";
import httpCommon from "../http-common";
import {ErrorService} from "../service/ErrorService";
import {Invoice} from "@/types/Invoice.ts";
import {TaskType} from "@/types/TaskType.ts";
import {InvoiceCorrection} from "@/types/InvoiceCorrection.ts";

export const useInvoiceStore = defineStore("invoice", {
    state: () => ({
        loadingInvoices: false,
        loadingInvoiceCorrections: false,

        invoices: [] as Invoice[],
        invoicesCached: [] as Invoice[],
    }),

    //getters = computed
    getters: {
        // getSortedInvoices: (state) =>
        //   state.invoices.sort((a, b) => a.idInvoice - b.idInvoice),
    },

    //actions = metody w komponentach
    actions: {

        //----------------------------------DATABASE-----------------------
        //
        //
        // INVOICE
        async getInvoiceByTaskFromDb(idTask: number, taskType: TaskType): Promise<Invoice[]> {
            console.log("START - getInvoiceByTaskFromDb()",idTask);
            this.loadingInvoices = true;

            try {
                const response = await httpCommon.get(`/v1/finance/invoice/task?idTask=${idTask}&status=${taskType.name}`);
                console.log("getInvoiceByTaskFromDb() - Ilosc[]: " + response.data.length);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getInvoiceByTaskFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return []
            } finally {
                this.loadingInvoices = false;
                console.log("END - getDesignersByStatusFromDb()");
            }
        },
        //
        // INVOICE_CORRECTION
        async getInvoiceCorrectionByInvoiceFromDb(idNumber: number, idYear: number): Promise<InvoiceCorrection[]> {
            console.log("START - getInvoiceCorrectionByInvoiceFromDb()");
            this.loadingInvoiceCorrections = true;

            try {
                const response = await httpCommon.get(`/v1/finance/correction/fv?idNumber=${idNumber}&idYear=${idYear}`);
                console.log("getInvoiceCorrectionByInvoiceFromDb() - Ilosc[]: " + response.data.length);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getInvoiceCorrectionByInvoiceFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return []
            } finally {
                this.loadingInvoiceCorrections = false;
                console.log("END - getInvoiceCorrectionByInvoiceFromDb()");
            }
        },
    },
});
