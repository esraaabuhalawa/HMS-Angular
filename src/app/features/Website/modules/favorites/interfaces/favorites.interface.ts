import { IApiResponse, IRoom } from "../../../../../shared/interfaces/general.interface";

export interface IAllData {
  favoriteRooms: IFavoriteRoom[];
  totalCount: number;
}

export interface IFavoriteRoom {
  _id: string;
  rooms: IRoom[];
  user: User;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  userName: string;
}


export interface IAddData {
  favoriteRoom: AddFavoriteRoom;
}

export interface AddFavoriteRoom {
  _id: string;
  rooms: string[];
  user: string;
  createdAt: string;
  updatedAt: string;
}

export type IAllFavoriteResponse = IApiResponse<IAllData>;
export type IAddFavoriteResponse = IApiResponse<IAddData>;

