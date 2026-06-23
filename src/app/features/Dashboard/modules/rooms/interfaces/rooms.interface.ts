export interface IRoomsResponse {
  success: boolean;
  message: string;
  data: Data;
}
interface Data {
  rooms: IRoom[];
  totalCount: number;
}

export interface IRoomDetailResponse {
  success: boolean;
  message: string;
  data: IRoomDetailData;
}

interface IRoomDetailData {
  room: IRoom;
}

export interface IDeleteResponse {
  success: boolean;
  message: string;
  data: null;
}

//General
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

export interface CreatedBy {
  _id: string;
  userName: string;
}

export interface Facility {
  _id: string;
  name: string;
}

