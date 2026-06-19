import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export const generalInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('HMSToken');
  
  const modifiedRequest = request.clone({
    url: `${environment.apiUrl}${request.url}`,
    setHeaders: (token) ? { Authorization: `Bearer ${token}` } : {}
  });
  return next(modifiedRequest);
};
