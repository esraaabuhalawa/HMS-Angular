import { JwtPayload } from 'jwt-decode';

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

export interface ICurrentUser {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: number;
  country: string;
  role: string;
  profileImage: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}
// ======Response Interfaces=======
export interface ICurrentUserResponse {
  success: boolean;
  message: string;
  data: {
    user: ICurrentUser;
  };
}

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
