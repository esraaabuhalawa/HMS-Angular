// ---- Generic API wrapper ----
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ---- General entities ----
export interface CreatedBy {
  _id: string;
  userName: string;
}

export interface Facility {
  _id: string;
  name: string;
}

export interface IRoom {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: Facility[];
  createdBy: CreatedBy;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
