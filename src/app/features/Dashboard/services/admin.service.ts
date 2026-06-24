import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IDashbordStatsResponse } from '../interfaces/iadmin.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private router = inject(Router);
  //admin/dashboard
  getDashboardStats(): Observable<IDashbordStatsResponse> {
    return this.http.get<IDashbordStatsResponse>('admin/dashboard');
  }
}
