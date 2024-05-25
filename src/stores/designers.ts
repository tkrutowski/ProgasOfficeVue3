import {defineStore} from "pinia";
import httpCommon from "../http-common";
import {ErrorService} from "../service/ErrorService";
import {Designer} from "@/types/Designer.ts";
import {ActiveStatus} from "@/types/Enums.ts";

export const useDesignerStore = defineStore("designer", {
    state: () => ({
        loadingDesigners: false,

        designers: [] as Designer[],
        designersCached: [] as Designer[],
    }),

    //getters = computed
    getters: {
        // getSortedInvoices: (state) =>
        //   state.invoices.sort((a, b) => a.idInvoice - b.idInvoice),
    },

    //actions = metody w komponentach
    actions: {
        //
        //GET FIRM BY ID
        //
        async getDesignerInCompany(status: ActiveStatus): Promise<Designer[]> {
            console.log("START - getDesignerInCompany:", status.name);

            switch (status.name) {
                case "INACTIVE":
                    return this.designersCached.filter(value => value.status.name === "INACTIVE")
                        .filter(value => value.employee);
                case "ACTIVE":
                    return this.designersCached.filter(value => value.status.name === "ACTIVE")
                        .filter(value => value.employee);
                case "ALL":
                    return this.designersCached.filter(value => value.employee);
                default:
                    return [];
            }
        },
        //
        // GET FULL NAME
        getDesignerFullName(id:number):string{
            let result = this.designersCached.find(value => value.id===id);
            return result?.name + " " + result?.lastName
        },
        refreshDesignerCache(){
            this.getDesignersByStatusFromDb({name:"ALL",viewName:""})
                .then(value => this.designersCached=value)
        },

        //----------------------------------DATABASE-----------------------
        //
        //
        async getDesignersByStatusFromDb(status: ActiveStatus): Promise<Designer[]> {
            console.log("START - getDesignersByStatusFromDb()");
            this.loadingDesigners = true;

            try {
                const response = await httpCommon.get(`/v1/designer?status=` + status.name);
                console.log("getDesignersByStatusFromDb() - Ilosc[]: " + response.data.length);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getDesignersByStatusFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return []
            } finally {
                this.loadingDesigners = false;
                console.log("END - getGasConnectionQueriesByCompleteFromDb()");
            }
        },
    },
});
