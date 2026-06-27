import { CreatedBy, IApiResponse } from "../../../../../shared/interfaces/general.interface";

//list booking
interface IBookingsData {
  booking: IBooking[];
  totalCount: number;
}

export interface IBooking {
  _id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
  stripeChargeId?: string;
  user: CreatedBy;
  room: IRoom;
}

interface IRoom {
  _id: string;
  roomNumber: string;
}

export interface BookingParams {
  page: number;
  size: number;
}

//view booking
interface IBookingDetailsData {
  booking: IBooking;
}

//delete booking
interface IDeleteBookingData {
  room: IDeleteResult;
}

interface IDeleteResult {
  acknowledged: boolean;
  deletedCount: number;
}

// ---- Final response types ----
export type IBookingsResponse = IApiResponse<IBookingsData>;
export type IBookingDetailsResponse = IApiResponse<IBookingDetailsData>;
export type IDeleteBookingResponse = IApiResponse<IDeleteBookingData>;
