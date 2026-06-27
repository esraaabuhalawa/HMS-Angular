export interface IUserResponse {
  success: boolean;
  message: string;
  data: IData;
}

export interface IData {
  users: IUser[];
  totalCount: number;
}

export interface IUser {
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
export interface IUserDetailsResponse {
  success: boolean;
  message: string;
  data: IUser;
}
