import { HttpInterceptorFn } from '@angular/common/http';

export const unAuthInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
