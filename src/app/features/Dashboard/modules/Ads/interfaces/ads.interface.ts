import { CreatedBy, IRoom } from "../../rooms/interfaces/rooms.interface";
//Get All Ads Interfaces
export interface AdParams {
  page: number;
  size: number;
}

export interface IAdsResponse {
  success: boolean;
  message: string;
  data: AdsData;
}

interface AdsData {
  ads: IAd[];
  totalCount: number;
}

export interface IAd {
  _id: string;
  isActive: boolean;
  room: IRoom;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
}

// Ad Details Interfaces
export interface IAdDetailsResponse  {
  success: boolean;
  message: string;
  data: Data;
}

interface Data {
  ads: IAd;
}

//Add Ad Interfaces
export interface ICreateAddData {
  room: string;
  discount: number;
  isActive: boolean;
}

// Update Ad Interfaces
export interface IUpdateAdData {
  isActive: boolean;
  discount: number;
}

//Delete Ad Interface
export interface IDeleteAdResponse {
  success: boolean;
  message: string;
  data: IDeleteData;
}

interface IDeleteData {
  ads: IDeleteAds;
}

interface IDeleteAds {
  acknowledged: boolean;
  deletedCount: number;
}
