import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private http = inject(HttpClient);

    private baseUrl = `${environment.apiUrl}/rooms`;

  createRoom(data: FormData) {
    return this.http.post(this.baseUrl, data);
  }

  getRooms() {
    return this.http.get(this.baseUrl);
  }


}
