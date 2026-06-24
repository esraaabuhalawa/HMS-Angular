// export interface IAdmin {}
export interface IDashbordStatsResponse {
  success: boolean;
  message: string;
  data: Data;
}
export interface Data {
  rooms: number;
  facilities: number;
  bookings: Bookings;
  ads: number;
  users: Users;
}

export interface Users {
  user: number;
  admin: number;
}

export interface Bookings {
  pending: number;
  completed: number;
}
