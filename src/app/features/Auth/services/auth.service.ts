import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ICurrentUser,
  ILogin,
  ILoginResponse,
  IDecodedToken,
  ICurrentUserResponse,
  IResetResponse,
  IReset,
} from '../interfaces/auth';

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

  onResetPass(data: IReset): Observable<IResetResponse> {
    return this.http.post<IResetResponse>('portal/users/reset-password', data);
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
  getCurrentUserProfile(id: string): Observable<ICurrentUserResponse> {
    return this.http.get<ICurrentUserResponse>(`portal/users/${id}`);
  }

  loadCurrentUser(): void {
    const token = localStorage.getItem('HMSToken');
    if (!token) return;

    const decoded = jwtDecode<IDecodedToken>(token);
    localStorage.setItem('role', decoded.role);

    this.getCurrentUserProfile(decoded._id).subscribe({
      next: (res: ICurrentUserResponse) => {
        this.currentUserSubject.next(res.data.user);
      },
      error: () => {
        this.currentUserSubject.next(null);
      },
    });
  }

  getRole(): string | null {
    return localStorage.getItem('role') || null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('HMSToken');
  }

  logout() {
    localStorage.removeItem('HMSToken');
    localStorage.removeItem('role');
    this.router.navigate(['/auth/login']);
  }

  loginWithGoogle(idToken: string | undefined): void {
    if (!idToken) {
      console.error('No ID token provided');
      return;
    }

    this.http
      .post<ILoginResponse>(`portal/users/auth/google`, {
        accessToken: idToken,
      })
      .subscribe({
        next: (res: ILoginResponse) => {
          console.log('Login successful', res);
          if (res.data && res.data.token) {
            localStorage.setItem('HMSToken', res.data.token);
            // this.loadCurrentUser();
            this.router.navigate(['/website']);
          }
        },
        error: (err: any) => {
          console.error('Error details:', err.error);
        },
      });
  }




  forgotPassword(email: string): Observable<any> {
  return this.http.post('portal/users/forgot-password', { email });
}

  // loginWithFacebook(accessToken: string, userID: string): void {
  //   if (!accessToken || !userID) {
  //     console.error('Missing accessToken or userID');
  //     return;
  //   }

  //   this.http
  //     .post<ILoginResponse>(`portal/users/auth/facebook`, {
  //       accessToken: accessToken,
  //       userID: userID,
  //     })
  //     .subscribe({
  //       next: (res: ILoginResponse) => {
  //         console.log('Facebook login successful', res);
  //         if (res.data && res.data.token) {
  //           localStorage.setItem('HMSToken', res.data.token);
  //           this.getProfile();
  //           this.router.navigate(['/dashboard/home']);
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Facebook login error:', err.error);
  //       },
  //     });
  // }

  register(data: FormData): Observable<ICurrentUserResponse> {
    return this.http.post<ICurrentUserResponse>('portal/users', data);
  }
}
