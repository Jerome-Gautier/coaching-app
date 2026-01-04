import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  template: `
    <div class="navbar">
      <ul class="nav-list">
        <li>
          <button (click)="setSection('accueil')" [class.active]="section === 'accueil'">
            Accueil
          </button>
        </li>
        <li>
          <button (click)="setSection('suivi')" [class.active]="section === 'suivi'">
            Suivi
          </button>
        </li>
        <li>
          <button (click)="setSection('parametres')" [class.active]="section === 'parametres'">
            Paramètres
          </button>
        </li>
      </ul>
    </div>
  `,
  styles: `
    .navbar {
      display: flex;
      justify-content: center;  
      align-items: space-evenly;
      position: fixed;
      bottom: 0;
      width: 100%;      
      background-color: #333;
      overflow: hidden;
    }
    .nav-list {
      display: flex;
      justify-content: space-around;
      gap: 10px;
      width: 100%;
      padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
      background: #ffffff;
      border-top: 1px solid var(--line);
      box-shadow: 0 -4px 12px rgba(0, 0, 0, .05);
    }
    .nav-list li {
      text-align: center;
      width: 100%;
    }
    .nav-list li button {
      background: #f1f5fb;
      color: var(--text);
      border: 1px solid var(--line);
      padding: 10px 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      width: 100%;
      cursor: pointer;
    }
    .nav-list li button.active {
      outline: 2px solid var(--primary);
      background: #e8f4ff;
      color: var(--primary);
    }
    `,
})
export class Navbar {
  @Input() section: string = '';
  @Output() sectionChange = new EventEmitter<string>();

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(this.section);
  }
}
