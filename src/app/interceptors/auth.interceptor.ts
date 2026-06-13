import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { serverUrl } from '../services/data';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip token injection for auth endpoints (login, refresh)
  if (req.url.includes('/api/user')) {
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
        fetch(`${serverUrl}/api/user/refresh`, {
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
