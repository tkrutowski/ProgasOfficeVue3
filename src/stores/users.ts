import {defineStore} from "pinia";
import httpCommon from "../http-common";
import {ErrorService} from "../service/ErrorService";
import {Privilege, Role, User} from "@/types/User.ts";

export const useUserStore = defineStore("user", {
    state: () => ({
        loadingUsers: false,
        loadingPrivileges: false,
        loadingRoles: false,

        users: [] as User[],
        roles: [] as Role[]
    }),

    //getters = computed
    getters: {
        // getSortedInvoices: (state) =>
        //   state.invoices.sort((a, b) => a.idInvoice - b.idInvoice),
    },

    //actions = metody w komponentach
    actions: {

        getNotUserRoles(userRoles: Role[]) {
            console.log('userRoles', userRoles);
            return this.getRolesAllFromDb()
                .then((roles: Role[]) => {
                    console.log('Role1', roles);
                    console.log('Role2', roles.filter(role =>
                        !userRoles.some(userRole => userRole.id === role.id)));
                    return roles.filter(role =>
                        !userRoles.some(userRole => userRole.id === role.id)
                    );
                });
        },

        //----------------------------------DATABASE-----------------------
        //
        //
        async getUsersFromDb(): Promise<User[]> {
            console.log("START - getUsersFromDb()");
            this.loadingUsers = true;

            try {
                const response = await httpCommon.get(`/v1/user`);
                console.log("getUsersFromDb() - Ilosc[]: " + response.data.length);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getUsersFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return []
            } finally {
                this.loadingUsers = false;
                console.log("END - getUsersFromDb()");
            }
        },
        //
        // GET Privileges by user
        //
        async getPrivilegesByUserFromDb(idUser: number): Promise<Privilege[]> {
            console.log("START - getUsersFromDb()");
            this.loadingPrivileges = true;

            try {
                const response = await httpCommon.get(`/v1/user/role/`+ idUser);
                console.log("getPrivilegesByUserFromDb() - Ilosc[]: " + response.data.length);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getPrivilegesByUserFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return []
            } finally {
                this.loadingPrivileges = false;
                console.log("END - getPrivilegesByUserFromDb()");
            }
        },
        //
        //UPDATE Privilege
        //
        async updatePrivilegeDb(privilege: Privilege) {
            console.log("START - updatePrivilegeDb()");
            try {
                await httpCommon.put(`/v1/user/role`, privilege);
                return true;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR updatePrivilegeDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return false;
            } finally {
                console.log("END - updatePrivilegeDb()");
            }
        },
        //
        // ADD Privileges to user
        //
        async addPrivilegesToUserFromDb(idUser: number, idRole: number) {
            console.log("START - addPrivilegesToUSerFromDb()");

            try {
                await httpCommon.post(`/v1/user/role?userID=${idUser}&roleID=${idRole}`);
                return true;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR addPrivilegesToUSerFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return false
            } finally {
                console.log("END - addPrivilegesToUSerFromDb()");
            }
        },
        //
        // DELETE Privileges from user
        //
        async deletePrivilegesFromUserFromDb(idUser: number, idRole: number) {
            console.log("START - addPrivilegesToUSerFromDb()");

            try {
                await httpCommon.delete(`/v1/user/role?userID=${idUser}&roleID=${idRole}`);
                return true;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR addPrivilegesToUSerFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return false
            } finally {
                console.log("END - addPrivilegesToUSerFromDb()");
            }
        },
        //
        // GET ALL roles
        //
        async getRolesAllFromDb(): Promise<Role[]> {
            console.log("START - getUsersFromDb()");
            this.loadingRoles = true;

            try {
                const response = await httpCommon.get(`/v1/user/role`);
                console.log("getPrivilegesByUserFromDb() - Ilosc[]: " + response.data.length);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getPrivilegesByUserFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return []
            } finally {
                this.loadingRoles = false;
                console.log("END - getPrivilegesByUserFromDb()");
            }
        },
    },
});
