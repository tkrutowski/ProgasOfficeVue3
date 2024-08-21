type PrivilegeType = "NULL" | "WRITE" | "WRITE_ALL" | "READ" | "READ_ALL" | "DELETE" | "DELETE_ALL";
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  username: string;
  enabled: boolean;
  notLocked: boolean;
  idEmployee: number;
  idDesigner: number;
}

export interface Privilege {
  id: number;
  idUser: number;
  role: Role;
  read: PrivilegeType;
  write: PrivilegeType;
  delete: PrivilegeType;
}

export interface Role {
  id: number;
  name: string;
}