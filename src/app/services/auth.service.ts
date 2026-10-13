import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface AuthUser {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  sex: 'male' | 'female' | null;
  weight: number | null;
  height: number | null;
  body_fat_percentage: number | null;
  nutrition_notes: string | null;
  workouts_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  public username$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  getUser() {
    return this.userSubject.value;
  }

  loadFromStorage() {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const url = this.apiConfig.getFullUrl('/user');
      const resp = await lastValueFrom(this.http.post<LoginResponse>(url, { email, password }));
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

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await lastValueFrom(
          this.http.post(this.apiConfig.getFullUrl('/user/logout'), {
            refresh_token: refreshToken,
          }),
        );
      } catch {
        // Local logout still succeeds if the token is already invalid or the API is offline.
      }
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    this.userSubject.next(null);
  }
}
