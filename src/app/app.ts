import { Component, signal } from '@angular/core';
import { Homepage } from './components/homepage/homepage';
import { Navbar } from "./components/navbar/navbar";
import { Suivi } from "./components/suivi/suivi";
import { Parametres } from "./components/parametres/parametres";

@Component({
  selector: 'app-root',
  imports: [Homepage, Navbar, Suivi, Parametres],
  template: `
    <div class="app-container">
      <div class="main-container">
        @if (section === 'accueil') {
          <app-homepage />
        } @else if (section === 'suivi') {
          <app-suivi />
        } @else if (section === 'parametres') {
          <app-parametres />
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
  `,
})
export class App {
  protected readonly title = signal('Coaching App');
  section: string = 'accueil';
}
