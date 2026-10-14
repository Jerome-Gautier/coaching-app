import { Component, signal, computed, Signal } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Homepage } from './components/homepage/homepage';
import { Navbar } from "./components/navbar/navbar";
import { Suivi } from "./components/suivi/suivi";
import { Parametres } from "./components/parametres/parametres";
import { Login } from "./components/login/login";
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [Homepage, Navbar, Suivi, Parametres, Login],
  template: `
    <div class="app-container">
      <div class="main-container">
        @if (isLoggedIn()) {
          <header class="topbar">
            <div class="user-info">
              <span class="user-label">Connecté en tant que</span>
              <span class="user-name">
                {{ userData()?.first_name }} {{ userData()?.last_name }}
              </span>
            </div>

            <button type="button" class="logout-btn" (click)="logout()" aria-label="Se déconnecter">
              <span>Déconnexion</span>
              <span class="logout-icon">↗</span>
            </button>
          </header>
        }
        @if (!isLoggedIn()) {
          <app-login />
        } @else {
          @if (section === 'accueil') {
            <app-homepage />
          } @else if (section === 'suivi') {
            <app-suivi />
          } @else if (section === 'parametres') {
            <app-parametres />
          }
        }
      </div>

      <app-navbar [section]="section" (sectionChange)="section = $event" />
    </div>
  `,
  styles: `
    .app-container {
      font-family: Arial, sans-serif;
      min-height: 100vh;
      box-sizing: content-box;
      margin-top: 10px;
      margin-bottom: 60px;
    }
    .app-container .section-title {
      text-align: center;
      text-transform: uppercase;
    }
    .main-container {
      background: linear-gradient(135deg, #d8ecff 0%, #f3f9ff 60%, #ffffff 100%);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 16px;
      box-shadow: none;
      min-height: calc(100vh - 90px);
      max-width: 430px;
      margin: 0 auto;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 4px 2px 14px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(100, 140, 180, 0.18);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .user-label {
      font-size: 11px;
      font-weight: 400;
      color: #8195a8;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #304b63;
      overflow-wrap: anywhere;
    }

    .logout-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      flex-shrink: 0;

      padding: 8px 12px;
      border: 1px solid #d5e2ed;
      border-radius: 8px;

      background: rgba(255, 255, 255, 0.5);
      color: #647e95;

      font-family: inherit;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;

      transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
    }

    .logout-btn:hover {
      background: #ffffff;
      border-color: #b9cfdf;
      color: #294b68;
    }

    .logout-btn:active {
      background: #eaf3fb;
    }

    .logout-btn:focus-visible {
      outline: 2px solid #6699c4;
      outline-offset: 3px;
    }

    .logout-icon {
      font-size: 15px;
      line-height: 1;
    }
  `,
})
export class App {
  protected readonly title = signal('Coaching App');
  section: string = 'accueil';

  userData!: Signal<any | null>;
  isLoggedIn!: Signal<boolean>;

  constructor(private auth: AuthService) {
    this.userData = toSignal(this.auth.username$);
    this.isLoggedIn = computed(() => !!this.userData());
  }

  ngOnInit() {
    this.auth.loadFromStorage();
  }

  logout() {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');

    window.location.reload();
  }
}