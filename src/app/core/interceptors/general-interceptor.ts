import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const generalInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('HMSToken');

  if (request.url.includes('/i18n/')) { //|| /^https?:\/\//i.test(request.url)
    return next(request);
  }

  const modifiedRequest = request.clone({
    url: `${environment.apiUrl}${request.url}`,
    setHeaders: (token) ? { Authorization: `${token}` } : {}
  });
  return next(modifiedRequest);
};
