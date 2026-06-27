import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FacilityParams,
  ICreateFacility,
  IDeleteFacilityResponse,
  IFacilityDetailsResponse,
  IFacilityResponse,
  IUpdateFacility,
  IUpdateFacilityResponse,
} from '../interfaces/facilities.interface';

@Injectable({
  providedIn: 'root',
})
export class FacilitiesService {
  private readonly http = inject(HttpClient);

  getAllFacilities(paramsData: FacilityParams): Observable<IFacilityResponse> {
    let params = new HttpParams()
      .set('page', paramsData.page.toString())
      .set('size', paramsData.size.toString());
    return this.http.get<IFacilityResponse>('admin/room-facilities', { params });
  }

  getFacilityDetails(id: string): Observable<IFacilityDetailsResponse> {
    return this.http.get<IFacilityDetailsResponse>(`admin/room-facilities/${id}`);
  }

  createFacility(data: ICreateFacility): Observable<IFacilityDetailsResponse> {
    return this.http.post<IFacilityDetailsResponse>('admin/room-facilities', data);
  }

  updateFacility(id: string, data: IUpdateFacility): Observable<IUpdateFacilityResponse> {
    return this.http.put<IUpdateFacilityResponse>(`admin/room-facilities/${id}`, data);
  }

  deleteFaciliy(id: string): Observable<IDeleteFacilityResponse> {
    return this.http.delete<IDeleteFacilityResponse>(`admin/room-facilities/${id}`);
  }
}
