import { JwtPayload } from 'jwt-decode';

export interface ICurrentUser {
  id: number;
  userName: string;
  email: string;
  country: string;
  phoneNumber: string;
  imagePath?: string;
  group: IGroup;
  creationDate: string;
  modificationDate: string;
}

export interface IGroup {
  id: number;
  name: string;
  creationDate: string;
  modificationDate: string;
}

export interface IDecodedToken extends JwtPayload {
  _id: string;
  role: string;
  verified: boolean;
  iat: number;
  exp: number;
}

export interface ILogin {
  email: string;
  password: string;
}
// ======Response Interfaces=======
export interface ILoginResponse {
  success: boolean;
  message: string;
  data: ILoginData;
}

export interface ILoginData {
  user: IUser;
  token: string;
}

export interface IUser {
  _id: string;
  userName: string;
  role: string;
}

export interface IRegisterResponse {
  message: string;
}
