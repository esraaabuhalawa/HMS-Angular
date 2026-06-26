import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingParams, IBookingDetailsResponse, IBookingsResponse, IDeleteBookingResponse } from '../interfaces/booking.interface';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  private http = inject(HttpClient);


  //list booking
   getAllBookings(paramsData: BookingParams): Observable<IBookingsResponse> {
    const params = new HttpParams()
      .set('page', paramsData.page.toString())
      .set('size', paramsData.size.toString());

    return this.http.get<IBookingsResponse>('admin/booking', { params });
  }

  //view booking
    getBookingDetails(id: string): Observable<IBookingDetailsResponse> {
    return this.http.get<IBookingDetailsResponse>(`admin/booking/${id}`);
  }

  //delete booking
  deleteBooking(id: string): Observable<IDeleteBookingResponse> {
  return this.http.delete<IDeleteBookingResponse>(`admin/booking/${id}`);
}

}
