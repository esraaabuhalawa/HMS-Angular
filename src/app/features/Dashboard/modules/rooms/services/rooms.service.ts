import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { IDeleteResponse, IRoomDetailResponse, IRoomsResponse, ICreateRoomResponse, IFacilitiesResponse, RoomParams } from '../interfaces/rooms.interface';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private http = inject(HttpClient);

  getAllRooms(paramsData: RoomParams): Observable<IRoomsResponse> {
    let params = new HttpParams().set('page', paramsData.page.toString()).set('size', paramsData.size.toString());

    if (paramsData.search) params = params.set('search', paramsData.search);
    if (paramsData.capacity) params = params.set('capacity', paramsData.capacity.toString());
    if (paramsData.facility) params = params.set('facility', paramsData.facility);

    return this.http.get<IRoomsResponse>('admin/rooms', { params });
  }

  //To get Data for Local
  getAllRoomsLocally(): Observable<IRoomsResponse> {
    return this.getAllRooms({ page: 1, size: 1 }).pipe(
      switchMap((res) => {
        const total = res.data.totalCount;

        if (total <= 1) {
          return of(res); // already have everything, skip second call
        }

        return this.getAllRooms({ page: 1, size: total });
      })
    );
  }

  getRoomDetails(id: string): Observable<IRoomDetailResponse> {
    return this.http.get<IRoomDetailResponse>(`admin/rooms/${id}`)
  }

  createRoom(data: FormData): Observable<ICreateRoomResponse> {
    return this.http.post<ICreateRoomResponse>('admin/rooms', data);
  }

  updateRoom(id: string, data: FormData): Observable<ICreateRoomResponse> {
    return this.http.put<ICreateRoomResponse>(
      `admin/rooms/${id}`,
      data
    );
  }

  deleteRoom(id: string): Observable<IDeleteResponse> {
    return this.http.delete<IDeleteResponse>(`admin/rooms/${id}`)
  }

  // GEt FAcilities Data
  getAllFacilities(): Observable<IFacilitiesResponse> {
    return this.http.get<IFacilitiesResponse>('admin/room-facilities');
  }
}
