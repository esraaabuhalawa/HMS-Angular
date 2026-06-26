import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserDetailsResponse, IUserResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  //admin/users?page=1&size=10
  getUserList(pageNum: number, pageSize: number): Observable<IUserResponse> {
    return this.http.get<IUserResponse>('admin/users', {
      params: {
        page: pageNum,
        size: pageSize,
      },
    });
  }
  //admin/users/6a3c413d239f70438ca80637
  getUserDetails(id: string): Observable<IUserDetailsResponse> {
    return this.http.get<IUserDetailsResponse>(`admin/users/${id}`);
  }
}
