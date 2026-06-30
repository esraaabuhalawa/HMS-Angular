import { inject, Injectable } from '@angular/core';
import { IRoomDetailResponse, IRoomsResponse, RoomParams } from '../interfaces/rooms.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private http = inject(HttpClient);

  getAllRooms(paramsData: RoomParams): Observable<IRoomsResponse> {
    let params = new HttpParams().set('page', paramsData.page.toString()).set('size', paramsData.size.toString());

    if (paramsData.startDate) {
      params = params.set('startDate', paramsData.startDate);
    }
    if (paramsData.endDate) {
      params = params.set('endDate', paramsData.endDate);
    }
    return this.http.get<IRoomsResponse>('portal/rooms/available', { params });
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
    return this.http.get<IRoomDetailResponse>(`portal/rooms/${id}`)
  }
}
