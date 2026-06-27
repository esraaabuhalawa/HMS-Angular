export interface FacilityParams {
  page: number;
  size: number;
}

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
  data: {
    facility: IFacility;
  };
}
export interface Data {
  facilities: IFacility;
}

export interface IDeleteFacilityResponse {
  success: boolean;
  message: string;
  data: Data;
}

export interface ICreateFacility {
  name: string;
}
export interface IUpdateFacility {
  name: string;
}
export interface IUpdateFacilityResponse {
  success: boolean;
  message: string;
  data: {
    room: IFacility;
  };
}
