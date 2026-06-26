import { inject, Injectable } from '@angular/core';
import {
  AdParams, IAdDetailsResponse,
  IAdsResponse, ICreateAdData, IDeleteAdResponse, IUpdateAdData
} from '../interfaces/ads.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AdsService {
  private http = inject(HttpClient);

  getAllAds(paramsData: AdParams): Observable<IAdsResponse> {
    const params = new HttpParams()
      .set('page', paramsData.page.toString())
      .set('size', paramsData.size.toString());

    return this.http.get<IAdsResponse>('admin/ads', {
      params,
    });
  }

  getAdDetails(id: string): Observable<IAdDetailsResponse> {
    return this.http.get<IAdDetailsResponse>(`admin/ads/${id}`)
  }

  createAd(data: ICreateAdData): Observable<IAdDetailsResponse> {
    return this.http.post<IAdDetailsResponse>('admin/ads', data);
  }

  updateAd(id: string, data: IUpdateAdData): Observable<IAdDetailsResponse> {
    return this.http.put<IAdDetailsResponse>(`admin/ads/${id}`, data);
  }

  deleteAd(id: string): Observable<IDeleteAdResponse> {
    return this.http.delete<IDeleteAdResponse>(`admin/ads/${id}`)
  }
}
