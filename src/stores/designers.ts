import {defineStore} from "pinia";
import httpCommon from "../http-common";
import {ErrorService} from "../service/ErrorService";
import {Designer, DesignerTraffic} from "@/types/Designer.ts";
import {ActiveStatus} from "@/types/Enums.ts";

export const useDesignerStore = defineStore("designer", {
    state: () => ({
        loadingDesigners: false,
        loadingDesignersTraffic: false,

        designers: [] as Designer[],
        designersTraffic: [] as DesignerTraffic[],
        designersCached: [] as Designer[],
        designersTrafficCached: [] as DesignerTraffic[],
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
        refreshDesignerTrafficCache(){
            this.getDesignersTrafficByStatusFromDb({name:"ALL",viewName:""})
                .then(value => this.designersTrafficCached=value)
        },

        //----------------------------------DATABASE-----------------------
        //
        //
        // DESIGNERS
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
                console.log("END - getDesignersByStatusFromDb()");
            }
        },
        //TRAFFIC DESIGNERS
        async getDesignersTrafficByStatusFromDb(status: ActiveStatus): Promise<DesignerTraffic[]> {
            console.log("START - getDesignersTrafficByStatusFromDb()");
            this.loadingDesignersTraffic = true;

            try {
                const response = await httpCommon.get(`/v1/designer/traffic?status=` + status.name);
                console.log("getDesignersTrafficByStatusFromDb() - Ilosc[]: " + response.data.length);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getDesignersTrafficByStatusFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return []
            } finally {
                this.loadingDesignersTraffic = false;
                console.log("END - getDesignersTrafficByStatusFromDb()");
            }
        },
    },
});
