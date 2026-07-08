import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdParams, IAdsResponse, IAdDetailsResponse } from '../../Dashboard/modules/Ads/interfaces/ads.interface';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  private http = inject(HttpClient);

  getAllAds(paramsData: AdParams): Observable<IAdsResponse> {
    const params = new HttpParams()
      .set('page', paramsData.page.toString())
      .set('size', paramsData.size.toString());

    return this.http.get<IAdsResponse>('portal/ads', {
      params,
    });
  }

  getAdDetails(id: string): Observable<IAdDetailsResponse> {
    return this.http.get<IAdDetailsResponse>(`portal/ads/${id}`)
  }

}
