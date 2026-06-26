import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IFacilitiesResponse } from '../../rooms/interfaces/rooms.interface';
import { Observable } from 'rxjs';
import { IFacilityDetailsResponse, IFacilityResponse } from '../interfaces/facilities.interface';

@Injectable({
  providedIn: 'root',
})
export class FacilitiesService {
  private readonly http = inject(HttpClient);

  getAllFacilities(): Observable<IFacilityResponse> {
    return this.http.get<IFacilityResponse>('admin/room-facilities');
  }

  getFacilityDetails(id: string): Observable<IFacilityDetailsResponse> {
    return this.http.get<IFacilityDetailsResponse>(`admin/room-facilities/${id}`);
  }

  // createAd(data: ICreateAddData): Observable<IAdDetailsResponse> {
  //   return this.http.post<IAdDetailsResponse>('admin/ads', data);
  // }

  // updateAd(id: string, data: IUpdateAdData): Observable<IAdDetailsResponse> {
  //   return this.http.put<IAdDetailsResponse>(`admin/ads/${id}`, data);
  // }

  // deleteAd(id: string): Observable<IDeleteAdResponse> {
  //   return this.http.delete<IDeleteAdResponse>(`admin/ads/${id}`)
  // }
}
