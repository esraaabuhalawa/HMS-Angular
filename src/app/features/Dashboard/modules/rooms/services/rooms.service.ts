import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Facility,
  IFacilitiesResponse,
  IRoomsResponse,
  RoomParams,
} from '../interfaces/rooms.interface';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private http = inject(HttpClient);

  getAllRooms(paramsData: RoomParams): Observable<IRoomsResponse> {
    let params = new HttpParams()
      .set('page', paramsData.page.toString())
      .set('size', paramsData.size.toString());

    if (paramsData.search) params = params.set('search', paramsData.search);
    if (paramsData.capacity) params = params.set('capacity', paramsData.capacity.toString());
    if (paramsData.facility) params = params.set('facility', paramsData.facility);

    return this.http.get<IRoomsResponse>('admin/rooms', { params });
  }
  getAllFacilities(): Observable<IFacilitiesResponse> {
    return this.http.get<IFacilitiesResponse>('admin/room-facilities');
  }
}
