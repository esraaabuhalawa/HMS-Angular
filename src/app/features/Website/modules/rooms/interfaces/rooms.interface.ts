import { Facility, IApiResponse, IRoom } from '../../../../../shared/interfaces/general.interface';

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

// ---- Room Review ----
export interface RoomReviewUser {
  _id: string;
  userName: string;
  profileImage?: string;
}

export interface RoomReview {
  _id: string;
  room: {
    _id: string;
    roomNumber: string;
  };
  user: RoomReviewUser;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetRoomReviewsResponse {
  success: boolean;
  message: string;
  data: {
    roomReviews: RoomReview[];
    totalCount: number;
  };
}

export interface CreateReviewRequest {
  roomId: string;
  rating: number;
  review: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data: RoomReview;
}
// comment
export interface RoomCommentUser {
  _id: string;
  userName: string;
  profileImage?: string;
}

export interface RoomComment {
  _id: string;
  room: {
    _id: string;
    roomNumber: string;
  };
  user: RoomCommentUser;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCommentsResponse {
  success: boolean;
  message: string;
  data: {
    roomComments: RoomComment[];
    totalCount: number;
  };
}

export interface CreateCommentRequest {
  roomId: string;
  comment: string;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  data: RoomComment;
}
