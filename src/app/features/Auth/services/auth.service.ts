import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICurrentUser, ILogin, ILoginResponse, IDecodedToken } from '../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<ICurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  onLogin(data: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('portal/users/Login', data);
  }

  getProfile() {
    let token = localStorage.getItem('HMSToken');
    if (token) {
      let userDecode = jwtDecode<IDecodedToken>(token);
      localStorage.setItem('role', userDecode.role);
    }
  }

  updateCurrentUserData(data: FormData): Observable<any> {
    return this.http.put<any>('Users', data);
  }

  //====== get logged person Data ======
  getCurrentUserData(): Observable<ICurrentUser> {
    return this.http.get<ICurrentUser>('Users/currentUser');
  }

  getRole(): string | null {
    return localStorage.getItem('role') || null;
  }

  logout() {
    localStorage.removeItem('HMSToken');
    localStorage.removeItem('role');
    this.router.navigate(['/auth/login']);
  }

}
