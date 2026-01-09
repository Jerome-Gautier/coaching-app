import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

const userList = ["testuser"];

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
    console.log('Loaded user from storage:', this.userSubject.value);
  }

  login(username: string, password?: string) {
    console.log('Attempting login for user:', username);
    const exists = userList.includes(username);
    console.log('User exists:', exists);

    if (exists) {
      const user = { username };
      localStorage.setItem('auth_user', JSON.stringify(user));
      this.userSubject.next(user);
      return { success: true, message: 'Login successful' };
    } else {
        return { success: false, message: 'Utilisateur non trouvé.'};
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.userSubject.next(null);
  }
}
