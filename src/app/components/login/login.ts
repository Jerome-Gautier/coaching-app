import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  template: `
    <form class="login-card" (submit)="onSubmit($event)" novalidate>
      <h2>Connexion</h2>
      <label for="username">Identifiant</label>
      <input type="text" id="username" name="username" placeholder="Votre identifiant" />
      @if (error) {
      <div class="error" role="alert">{{ error }}</div>
      }

      <button type="submit" class="primary-btn" [disabled]="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        width: 100%;
      }
      .login-card {
        width: 100%;
        max-width: 420px;
        background: var(--surface);
        border-radius: 16px;
        padding: 22px;
        box-shadow: 0 10px 30px rgba(14, 20, 30, 0.08);
        border: 1px solid var(--line);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .login-card h2 {
        color: var(--text);
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 4px;
      }
      .login-card input[type='text'],
      .login-card input[type='password'],
      .login-card input[type='email'] {
        width: 100%;
        padding: 12px 14px;
        border-radius: 10px;
        border: 1px solid var(--line);
        background: transparent;
        color: var(--text);
        font-size: 15px;
        outline: none;
        transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.06s ease;
      }
      .login-card input:focus {
        box-shadow: 0 6px 18px rgba(77, 166, 255, 0.12);
        border-color: var(--primary);
        transform: translateY(-1px);
      }
      .login-card .primary-btn {
        margin-top: 8px;
      }
      @media (max-width: 420px) {
        .login-card {
          padding: 18px;
          border-radius: 12px;
        }
        :host {
          padding: 12px;
        }
      }
    `,
  ],
})
export class Login {
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const username = String(data.get('username') || '').trim();
    if (!username) {
      this.error = 'Veuillez renseigner un identifiant.';
      return;
    }
    this.error = null;
    this.loading = true;

    const response = this.auth.login(username);
    this.loading = false;

    if (!response.success) {
      this.error = response.message;
    }
  }
}