import { Facility, IApiResponse, IRoom } from "../../../../../shared/interfaces/general.interface";

// ---- Params ----
export interface RoomParams {
  page: number;
  size: number;
  startDate?: string;
  endDate?: string;
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




