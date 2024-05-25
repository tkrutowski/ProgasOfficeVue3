import {defineStore} from "pinia";
import httpCommon from "../http-common";
import {useAuthorizationStore} from "../stores/authorization";
import {ErrorService} from "../service/ErrorService";
import {GasconnectionQuery} from "../types/GasconnectionQuery";
import {TaskStatus} from "@/types/TaskStatus.ts";

export const useGasConnectionQueryStore = defineStore("gasConnectionQuery", {
    state: () => ({
        loadingGasConnectionQuery: false,

        gasConnectionQueries: [] as GasconnectionQuery[],
        gasConnectionCached: [] as GasconnectionQuery[],
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
        async getGasConnectionList(status: TaskStatus): Promise<GasconnectionQuery[]> {
            // console.log("GET_FIRM id:", id);
            const authorization = useAuthorizationStore();
            const result = await this.getGasConnectionQueriesByStatusFromDb(status)
            if (result) {
                this.gasConnectionQueries = result;

                switch (status.name) {
                    case "NOT_FINISHED":
                        if(authorization.isEmployee) this.gasConnectionCached = result;
                        return this.gasConnectionQueries;
                    case "OVER_DUE":
                    case "NOT_FINISHED_TECH":
                    case "NOT_FINISHED_END":
                        return this.gasConnectionQueries;
                    case "FINISHED":
                        return this.gasConnectionQueries;
                    case "ALL":
                        return this.gasConnectionQueries;
                    default:
                        return [];
                }
            } else
                return [];
        },
        async getGasConnectionCached(): Promise<GasconnectionQuery[]> {
            console.log("START - getGasConnectionCached");
            if (this.gasConnectionCached.length === 0) {
                const result = await this.getGasConnectionQueriesByStatusFromDb({
                    name: "NOT_FINISHED",
                    viewName: "Niezrealizowane"
                })
                if (result) {
                    this.gasConnectionCached = result;
                }
            }
            console.log("END - getGasConnectionCached");
            return this.gasConnectionCached;
        },

        async refreshGasConnectionCached() {
            console.log("START - refreshGasConnectionCached");

            const result = await this.getGasConnectionQueriesByStatusFromDb({
                name: "NOT_FINISHED",
                viewName: "Niezrealizowane"
            })
            if (result) {
                this.gasConnectionCached = result;
            }
            console.log("END - refreshGasConnectionCached");
        },

        //----------------------------------DATABASE-----------------------
        //
        //GET GASCONNECTIONS
        //
        async getGasConnectionQueriesFromDb(): Promise<void> {
            console.log("START - getGasConnectionQueriesFromDb()");
            this.loadingGasConnectionQuery = true;

            try {
                const response = await httpCommon.get(`/v1/query/gasconnection`);
                console.log("getGasConnectionQueriesFromDb() - Ilosc[]: " + response.data.length);
                this.gasConnectionQueries = response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getGasConnectionQueriesFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
            } finally {
                this.loadingGasConnectionQuery = false;
                console.log("END - getGasConnectionQueriesFromDb()");
            }
        },
        //
        //GET GASCONNECTIONS
        //
        async getGasConnectionQueriesByStatusFromDb(status: TaskStatus): Promise<GasconnectionQuery[] | undefined> {
            console.log("START - getGasConnectionQueriesByCompleteFromDb()");
            this.loadingGasConnectionQuery = true;

            try {
                const response = await httpCommon.get(`/v1/query/gasconnection?status=` + status.name)
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getGasConnectionQueriesByCompleteFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
            } finally {
                this.loadingGasConnectionQuery = false;
                console.log("END - getGasConnectionQueriesByCompleteFromDb()");

            }
        },
        //
        //GET   GASCONNECTION BY ID
        //
        async getGasConnectionQueryFromDb(id: number): Promise<GasconnectionQuery | undefined> {
            console.log("START - getGasConnectionQueryFromDb(" + id + ")");
            this.loadingGasConnectionQuery = true;

            try {
                const response = await httpCommon.get(`/v1/query/gasconnection/` + id);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getGasConnectionQueryFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
            } finally {
                this.loadingGasConnectionQuery = false;
                console.log("END - getGasConnectionQueryFromDb()");
            }
        },
    },
});
