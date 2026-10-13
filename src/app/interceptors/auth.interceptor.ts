import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiConfigService } from '../services/api-config.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiConfig = inject(ApiConfigService);
  const loginUrl = apiConfig.getFullUrl('/user');
  const refreshUrl = apiConfig.getFullUrl('/user/refresh');
  const logoutUrl = apiConfig.getFullUrl('/user/logout');

  // These endpoints authenticate with credentials or a refresh token.
  if ([loginUrl, refreshUrl, logoutUrl].includes(req.url)) {
    return next(req);
  }

  const token = localStorage.getItem('auth_token');
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) return throwError(() => err);

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return throwError(() => err);

      // Use fetch for the refresh call to avoid interceptor recursion
      return from(
        fetch(refreshUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }).then(r => (r.ok ? r.json() : null))
      ).pipe(
        switchMap((data) => {
          if (!data?.access_token) return throwError(() => err);
          localStorage.setItem('auth_token', data.access_token);
          const retried = req.clone({
            setHeaders: { Authorization: `Bearer ${data.access_token}` },
          });
          return next(retried);
        }),
        catchError(() => throwError(() => err))
      );
    })
  );
};
