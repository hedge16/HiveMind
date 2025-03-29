import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../_services/auth/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log(token);

  if (token) {
    // Clone request and add Authorization header with token
    req = req.clone({
      setHeaders: {
        Authorization : `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
