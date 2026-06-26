import { CreatedBy, IApiResponse, IRoom } from "../../../../../shared/interfaces/general.interface";

// ---- Params ----
export interface AdParams {
  page: number;
  size: number;
}

// ---- General entity ----
export interface IAd {
  _id: string;
  isActive: boolean;
  room: IRoom;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
}

// ---- Response payload shapes ----
export interface IAdsListData {
  ads: IAd[];
  totalCount: number;
}

export interface IAdDetailData {
  ads: IAd;
}

export interface IDeleteAdData {
  ads: {
    acknowledged: boolean;
    deletedCount: number;
  };
}

// ---- Final response types ----
export type IAdsResponse = IApiResponse<IAdsListData>;
export type IAdDetailsResponse = IApiResponse<IAdDetailData>;
export type IDeleteAdResponse = IApiResponse<IDeleteAdData>;

// ---- Create / Update payloads ----
export interface ICreateAdData {
  room: string;
  discount: number;
  isActive: boolean;
}

export interface IUpdateAdData {
  isActive: boolean;
  discount: number;
}
