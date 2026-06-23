import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { IDeleteResponse, IRoomDetailResponse, IRoomsResponse } from '../interfaces/rooms.interface';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private http = inject(HttpClient);

    private baseUrl = `${environment.apiUrl}/rooms`;

  createRoom(data: FormData) {
    return this.http.post(this.baseUrl, data);
  }




  // ============== Esraa Code ===================
  //Get All Rooms
  getRooms(): Observable<IRoomsResponse> {
    return this.http.get<IRoomsResponse>(`admin/rooms?page=1&size=10`)
  }
  //View Room Details
  getRoomDetails(id: string): Observable<IRoomDetailResponse> {
    return this.http.get<IRoomDetailResponse>(`admin/rooms/${id}`)
  }
  //Delete Room
  deleteRoom(id: string): Observable<IDeleteResponse> {
    return this.http.delete<IDeleteResponse>(`admin/rlooms/${id}`)
  }
}
