interface User {
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

export default User;
