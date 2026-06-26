import { CreatedBy } from '../../rooms/interfaces/rooms.interface';

//list booking
export interface IBookingsResponse {
  success: boolean;
  message: string;
  data: IBookingsData;
}

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
export interface IBookingDetailsResponse {
  success: boolean;
  message: string;
  data: IBookingDetailsData;
}

interface IBookingDetailsData {
  booking: IBooking;
}




//delete booking
export interface IDeleteBookingResponse {
  success: boolean;
  message: string;
  data: IDeleteBookingData;
}

interface IDeleteBookingData {
  room: IDeleteResult;
}

interface IDeleteResult {
  acknowledged: boolean;
  deletedCount: number;
}
