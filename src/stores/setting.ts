import {defineStore} from "pinia";
import httpCommon from "../http-common.ts";
import {ColumnView, AppSettings, GasConnectionSettings} from "@/types/Settings.ts";
import {ErrorService} from "@/service/ErrorService.ts";
import {UtilsService} from "@/service/UtilsService.ts";
// import * as jwt_decode from 'jwt-decode';
export const useSettingStore = defineStore("setting", {
    state: () => ({
        loadingSettings: false,
        savingSettings: false,
        settings: {
            userId: 0,
            gasConnectionSettings: {
                sortColumn: "",
                sortDirection: false,
                rowsNumber: 1,
                displayStatus: "",
                gasConnectionColumns: [] as ColumnView[],
            } as GasConnectionSettings,
        } as AppSettings,
    }),

    //getters = computed
    getters: {
        getGasConnectionVisibleColumns: (state) =>
            state.settings.gasConnectionSettings.gasConnectionColumns
                .filter(col => col.visible)
                .sort((a: ColumnView, b: ColumnView) => a.sortIndex - b.sortIndex)
                .map(col => ({...col})),
        getGasConnectionInvisibleColumns: (state) =>
            state.settings.gasConnectionSettings.gasConnectionColumns
                .filter(col => !col.visible)
                .sort((a: ColumnView, b: ColumnView) => a.header.localeCompare(b.header)),
        getGasConnectionStatus: (state) =>{
            const status = state.settings.gasConnectionSettings.displayStatus;
            return UtilsService.getStatus(status);
        },
        getGasConnectionLockedColumns: (state) =>
            state.settings.gasConnectionSettings.gasConnectionColumns
                .filter(col => col.frozen)
                .filter(col => col.visible)
                .sort((a: ColumnView, b: ColumnView) => a.header.localeCompare(b.header)),
    },
    //actions = metody w komponentach
    actions: {
        async getGasConnectionColumns(): Promise<ColumnView[]> {
            console.log("START getGasConnectionColumns()");
            if (this.settings.gasConnectionSettings.gasConnectionColumns && this.settings.gasConnectionSettings.gasConnectionColumns.length === 0) {
                await this.getSettingsFromDb()
            }
            console.log("END getGasConnectionColumns():", this.settings.gasConnectionSettings.gasConnectionColumns);
            return this.settings.gasConnectionSettings.gasConnectionColumns;//.sort((a: ColumnView, b: ColumnView) => a.header.localeCompare(b.header));

        },

        async updateGasConnectionSettings(gasConnectionSettings: GasConnectionSettings): Promise<boolean> {
            console.log("updateGasConnectionSettings()");
            console.log("updateGasConnectionSettings()", gasConnectionSettings);
            this.savingSettings = true;
            try {
                this.settings.gasConnectionSettings = gasConnectionSettings;
                let result = await this.updateSettingsGasConnectionDb();
                if (result) {
                    return true;
                }
                await this.getSettingsFromDb()
                return false;
            } catch (e) {
                console.log("ERROR updateGasConnectionSettings(): ", e);
                return false;
            } finally {
                this.savingSettings = false;
            }
        },

        // ---------------------------------------------------DATABASE-------------------------------------------
        async getSettingsFromDb(): Promise<void> {
            console.log("START - getSettingsFromDb()");
            this.loadingSettings = true;

            try {

                const response = await httpCommon.get(`/v1/settings`);
                console.log('Settings:', response);
                this.settings = response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getSettingsFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
            } finally {
                this.loadingSettings = false;
                console.log("END - getSettingsFromDb()");
            }
        },
        //
        //UPDATE SETTINGS
        //
        async updateSettingsGasConnectionDb(): Promise<boolean> {
            console.log("START - updateSettingsGasConnectionDb()");

            try {
                await httpCommon.put(`/v1/settings`, this.settings);
                // this.settings = response.data;
                return true;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR updateCardDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return false;
            } finally {
                console.log("END - updateCardDb()");
            }
        },
    },
});
