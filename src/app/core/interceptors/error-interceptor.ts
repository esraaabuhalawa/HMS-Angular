import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/Auth/services/auth.service';
import { SKIP_AUTH_ERROR_HANDLING } from '../context/http-context-tokens';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const skip = request.context.get(SKIP_AUTH_ERROR_HANDLING);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {

       if (!skip && (error.status === 401 || error.status === 402)) {
        authService.logout();
      }

      return throwError(() => error);
    })
  );

};
