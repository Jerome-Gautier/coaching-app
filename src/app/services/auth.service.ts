import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any | null>(null);
  public username$ = this.userSubject.asObservable();

  private loginUrl = `/api/user`;

  constructor(private http: HttpClient) {}

  getUser() {
    return this.userSubject.value;
  }

  loadFromStorage() {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  async login(email: string, password?: string) {
    try {
      const resp = await lastValueFrom(this.http.post<any>(this.loginUrl, { email, password }));
      if (!resp || !resp.access_token) {
        return { success: false, message: 'Invalid server response' };
      }

      localStorage.setItem('auth_token', resp.access_token);
      if (resp.refresh_token) localStorage.setItem('refresh_token', resp.refresh_token);
      if (resp.user) localStorage.setItem('auth_user', JSON.stringify(resp.user));
      this.userSubject.next(resp.user || null);

      return { success: true };
    } catch (err: any) {
      const message = err?.error?.message || err?.message || 'Login failed';
      return { success: false, message };
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    this.userSubject.next(null);
  }
}