export interface IFacility {
  _id: string;
  name: string;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
}

export interface CreatedBy {
  _id: string;
  userName: string;
}

export interface IFacilityResponse {
  success: boolean;
  message: string;
  data: FacilityData;
}

export interface FacilityData {
  facilities: IFacility[];
  totalCount: number;
}

export interface IFacilityDetailsResponse {
  success: boolean;
  message: string;
  data: Data;
}

interface Data {
  facilities: IFacility;
}
