// export interface RoomParams {
//   page: number;
//   size: number;
//   search?: string;
//   capacity?: number;
//   facility?: string;
// }
// export interface IRoomsResponse {
//   success: boolean;
//   message: string;
//   data: Data;
// }
// interface Data {
//   rooms: IRoom[];
//   totalCount: number;
// }

// export interface IRoomDetailResponse {
//   success: boolean;
//   message: string;
//   data: IRoomDetailData;
// }

// interface IRoomDetailData {
//   room: IRoom;
// }

// export interface IDeleteResponse {
//   success: boolean;
//   message: string;
//   data: null;
// }
// export interface ICreateRoomResponse {
//   success: boolean;
//   message: string;
//   data: {
//     room: IRoom;
//   };
// }


// //General
// export interface IRoom {
//   _id: string;
//   roomNumber: string;
//   price: number;
//   capacity: number;
//   discount: number;
//   facilities: Facility[];
//   createdBy: CreatedBy;
//   images: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CreatedBy {
//   _id: string;
//   userName: string;
// }

// export interface Facility {
//   _id: string;
//   name: string;
// }
// export interface IFacilitiesResponse {
//   success: boolean;
//   message: string;
//   data: {
//     facilities: Facility[];
//     totalCount: number;
//   };
// }
import { Facility, IApiResponse, IRoom } from "../../../../../shared/interfaces/general.interface";

// ---- Params ----
export interface RoomParams {
  page: number;
  size: number;
  search?: string;
  capacity?: number;
  facility?: string;
}

// ---- Paginated list shape ----
export interface IPaginatedData<T> {
  totalCount: number;
}

// ---- Response payload shapes ----
export interface IRoomsData {
  rooms: IRoom[];
  totalCount: number;
}

export interface IRoomDetailData {
  room: IRoom;
}

export interface IFacilitiesData {
  facilities: Facility[];
  totalCount: number;
}

// ---- Final response types (generic-based) ----
export type IRoomsResponse = IApiResponse<IRoomsData>;
export type IRoomDetailResponse = IApiResponse<IRoomDetailData>;
export type ICreateRoomResponse = IApiResponse<IRoomDetailData>;
export type IFacilitiesResponse = IApiResponse<IFacilitiesData>;
export type IDeleteResponse = IApiResponse<null>;




