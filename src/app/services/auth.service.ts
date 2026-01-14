import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { UserModel, userList } from './data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any | null>(null);
  public username$ = this.userSubject.asObservable();

  private loginUrl = '/api/login';

  constructor(private http: HttpClient) {}

  loadFromStorage() {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password?: string) {
    const exists = Object.prototype.hasOwnProperty.call(userList, username);

    if (exists) {
      const userData: UserModel = userList[username as keyof typeof userList];
      localStorage.setItem('auth_user', JSON.stringify(userData));
      this.userSubject.next(userData);
      return { success: true, message: 'Login successful' };
    } else {
      return { success: false, message: 'Utilisateur non trouvé.' };
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.userSubject.next(null);
  }
}