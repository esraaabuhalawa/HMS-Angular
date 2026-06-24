import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDeleteResponse, IRoomDetailResponse, IRoomsResponse ,ICreateRoomResponse ,IFacilitiesResponse} from '../interfaces/rooms.interface';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private http = inject(HttpClient);



createRoom(data: FormData): Observable<ICreateRoomResponse> {
  return this.http.post<ICreateRoomResponse>('admin/rooms', data);
}

updateRoom(id: string, data: FormData): Observable<ICreateRoomResponse> {
  return this.http.put<ICreateRoomResponse>(
    `admin/rooms/${id}`,
    data
  );
}

getFacilities() {
  return this.http.get<IFacilitiesResponse>(
    'admin/room-facilities'
  );
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
