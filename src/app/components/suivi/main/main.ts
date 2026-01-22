import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-suivi-main',
  imports: [],
  template: `
    <div class="main-container">
      <button class="primary-btn" (click)="setSection('profile')">👤 Profil</button>

      <div class="suivi-menu-grid">
        <button class="suivi-btn" (click)="setSection('sleep')">😴 sommeil</button>
        <button class="suivi-btn" (click)="setSection('weights')">⚖️ poids</button>
        <button class="suivi-btn" (click)="setSection('steps')">👟 pas</button>
        <button class="suivi-btn" (click)="setSection('energy')">⚡ énergie</button>
        <button class="suivi-btn" (click)="setSection('todolist')">✅ to do list</button>
      </div>
    </div>
  `,
  styles: `
    .suivi-menu-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      width: 100%;
      margin-top: 12px;
    }
    .suivi-menu-grid .suivi-btn {
      all: unset;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      min-height: 100px;
      padding: 18px;
      background: linear-gradient(135deg, #4da6ff, #52e0c8);
      border-radius: 18px;
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.25) inset;
      font-weight: 700;
      font-size: 15px;
      text-align: center;
      color: #ffffff;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
      text-transform: uppercase;
      cursor: pointer;
    }
  `,
})
export class Main {
  @Input() section: string = '';
  @Output() sectionChange: EventEmitter<string> = new EventEmitter<string>();

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }
}
