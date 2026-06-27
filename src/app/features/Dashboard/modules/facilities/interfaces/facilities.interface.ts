import { CreatedBy, IApiResponse } from '../../../../../shared/interfaces/general.interface';

export interface IFacility {
  _id: string;
  name: string;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
}

// --- Request payloads ---
export interface FacilityParams {
  page: number;
  size: number;
}

export interface ICreateFacility {
  name: string;
}

export interface IUpdateFacility {
  name: string;
}

// --- Response payloads ---
export interface FacilityListData {
  facilities: IFacility[];
  totalCount: number;
}

export type IFacilityResponse = IApiResponse<FacilityListData>;

export type IFacilityDetailsResponse = IApiResponse<{ facility: IFacility }>;

export type IUpdateFacilityResponse = IApiResponse<{ facility: IFacility }>;

export type IDeleteFacilityResponse = IApiResponse<{ facility: IFacility }>;
