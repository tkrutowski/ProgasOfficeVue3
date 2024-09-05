import {defineStore} from "pinia";
import httpCommon from "../http-common.ts";
import jwt_decode from "jwt-decode";
import {ErrorService} from "@/service/ErrorService.ts";
import {useSettingStore} from "@/stores/setting.ts";
import moment from "moment";

export const useAuthorizationStore = defineStore("authorization", {
    state: () => ({
        token: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        loginError: false,
        btnDisabled: false,
        isAuthenticated: false,
        loading: false,
        username: localStorage.getItem('username') || "",
        userPrivileges: [] as string[],
    }),

    //getters = computed
    getters: {

        isAuthenticatedOrToken():boolean{
            if(this.token) {
                const decoded: any = jwt_decode(this.token);
                return this.isAuthenticated || moment.unix(decoded.exp).isAfter(moment())
            }
            return this.isAuthenticated;
        },
        hasAccessAdmin(): boolean {
            try {
                const decoded: any = jwt_decode(this.token);
                return (
                    decoded.authorities.includes("ROLE_ADMIN")
                );
            } catch (error) {
                console.log("hasAccessFinance() ERROR", error);
                return false;
            }
        },
        hasAccessFinance(): boolean {
            try {
                const decoded: any = jwt_decode(this.token);
                return (
                    decoded.authorities.includes("ROLE_FINANCE") ||
                    decoded.authorities.includes("ROLE_ADMIN")
                );
            } catch (error) {
                console.log("hasAccessFinance() ERROR", error);
                return false;
            }
        },
        hasAccessTasks(): boolean {
            try {
                const decoded: any = jwt_decode(this.token);
                return (
                    decoded.authorities.includes("ROLE_TASKS") ||
                    decoded.authorities.includes("ROLE_ADMIN")
                );
            } catch (error) {
                console.log("hasAccessTasks() ERROR", error);
                return false;
            }
        },
        hasAccessTasksGasConnection(): boolean {
            try {
                const decoded: any = jwt_decode(this.token);
                return (
                    decoded.authorities.includes("ROLE_TASKS_CONNECTION") ||
                    decoded.authorities.includes("ROLE_ADMIN")
                );
            } catch (error) {
                console.log("hasAccessTasks() ERROR", error);
                return false;
            }
        },
        hasAccessTasksGasConnectionDesign(): boolean {
            try {
                const decoded: any = jwt_decode(this.token);
                return (
                    decoded.authorities.includes("ROLE_TASKS_CONNECTION_DESIGN") ||
                    decoded.authorities.includes("ROLE_ADMIN")
                );
            } catch (error) {
                console.log("hasAccessTasks() ERROR", error);
                return false;
            }
        },
        hasAccessTasksGasConnectionDesignReadAll(): boolean {
            try {
                const decoded: any = jwt_decode(this.token);
                return (
                    decoded.authorities.includes("TASKS_CONNECTION_DESIGN_READ_ALL") ||
                    decoded.authorities.includes("ROLE_ADMIN")
                );
            } catch (error) {
                console.log("hasAccessTasks() ERROR", error);
                return false;
            }
        },
        hasAccessTasksGasConnectionBuild(): boolean {
            try {
                const decoded: any = jwt_decode(this.token);
                console.log("ROLE_ADMIN", decoded.authorities.includes("ROLE_ADMIN"))
                console.log("ROLE_TASKS_CONNECTION_BUILD", decoded.authorities.includes("ROLE_TASKS_CONNECTION_BUILD"))
                console.log("RAZE|M", (
                    decoded.authorities.includes("ROLE_TASKS_CONNECTION_BUILD") ||
                    decoded.authorities.includes("ROLE_ADMIN")
                ))
                return (
                    decoded.authorities.includes("ROLE_TASKS_CONNECTION_BUILD") ||
                    decoded.authorities.includes("ROLE_ADMIN")
                );
            } catch (error) {
                console.log("hasAccessTasks() ERROR", error);
                return false;
            }
        },
        hasAccessTasksGasConnectionFinance(): boolean {
            try {
                const decoded: any = jwt_decode(this.token);
                return (
                    decoded.authorities.includes("ROLE_TASKS_CONNECTION_FINANCE") ||
                    decoded.authorities.includes("ROLE_FINANCE") ||
                    decoded.authorities.includes("ROLE_ADMIN")
                );
            } catch (error) {
                console.log("hasAccessTasks() ERROR", error);
                return false;
            }
        },
        isEmployee(): boolean {
            console.log("isEmployee()");
            try {
                const decoded: any = jwt_decode(this.token);
                return decoded.idEmployee > 0;
            } catch (error) {
                console.log("isEmployee() ERROR", error);
                return false;
            }
        },
        isEmployeeOrAdmin(): boolean {
            console.log("isEmployee()");
            try {
                const decoded: any = jwt_decode(this.token);
                if (decoded.authorities.includes("ROLE_ADMIN"))
                    return true;
                return decoded.idEmployee > 0;
            } catch (error) {
                console.log("isEmployee() ERROR", error);
                return false;
            }
        },
        isDesigner(): boolean {
            console.log("isDesigner()");
            try {
                const decoded: any = jwt_decode(this.token);
                return decoded.idDesigner > 0;
            } catch (error) {
                console.log("isDesigner() ERROR", error);
                return false;
            }
        },
        isDesignerOrHasAccessTaskGasConnectionDesign(): boolean {
            try {
                const decoded: any = jwt_decode(this.token);
                if (decoded.authorities.includes("ROLE_TASKS_CONNECTION_DESIGN") || decoded.authorities.includes("ROLE_ADMIN"))
                    return true;
                return decoded.idDesigner > 0;
            } catch (error) {
                console.log("isDesigner() ERROR", error);
                return false;
            }
        },
        getUserDesignerId(): number {
            console.log("getUserDesignerId()");
            try {
                const decoded: any = jwt_decode(this.token);
                return decoded.idDesigner;
            } catch (error) {
                console.log("getUserDesignerId() ERROR", error);
                return 0;
            }
        },

    },

    //actions = metody w komponentach
    actions: {
        logUser(token: string, refreshToken: string) {
            this.token = token;
            localStorage.setItem('accessToken', token);
            this.isAuthenticated = true;
            const decoded: any = jwt_decode(this.token);
            this.username = decoded.sub;
            localStorage.setItem('username', decoded.sub);

            this.refreshToken = refreshToken;
            localStorage.setItem('refreshToken', refreshToken);
        },
        //
        //LOGIN
        //
        async login(username: string, password: string) {
            console.log("START - login()");
            this.loading = true;
            this.btnDisabled = true;
            try {
                const res = await httpCommon
                    .post("/v1/auth/login", {
                        username: username,
                        password: password,
                    });

                if (!res.data.accessToken && res.status != 200) {
                    console.log("START - loginFailed()");
                    this.loginError = true;
                    this.$reset();

                    this.loading = false;
                    this.btnDisabled = false;
                    return false;
                }

                this.logUser(res.data.accessToken, res.data.refreshToken);

                this.loading = false;
                this.btnDisabled = false;
                this.loginError = false;

                return true;
            } catch (e) {
                console.log("ERROR login(): ", e);
                this.$reset();
                this.loginError = true;
                if (ErrorService.isAxiosError(e)) {
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
            } finally {
                this.loading = false;
                this.btnDisabled = false;
                console.log("END - login()");
            }
        },
        //
        //LOGOUT
        //
        logout(): void {
            console.log("START - logout()");
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            this.$reset(); //store reset
            this.router.replace({name: "login"});
        },
        //
        //REFRESH
        //
        async refresh() {
            console.log("START - refresh()");
            const refreshToken = localStorage.getItem('refreshToken') || null;
            try {
                const response = await httpCommon
                    .post("/v1/auth/refresh", {
                        refreshToken: refreshToken,
                    });
                if (response.status === 200) {
                    console.log("refresh() - success - update tokens");
                    this.logUser(response.data.accessToken, response.data.refreshToken);
                    const settingStore = useSettingStore();
                    if (settingStore.settings.userId === 0) {
                        await settingStore.getSettingsFromDb();
                    }

                }
                return response;
            } catch (e) {
                console.log("ERROR refresh(): ", e);
                this.logout();
                throw e;
            }
        }
    },
});
