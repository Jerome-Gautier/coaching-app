import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReturnBtn } from "../../return-button/return-btn";
import { loadProfileData } from '../../../../utils/utils';

@Component({
  selector: 'app-suivi-profile',
  imports: [ReturnBtn],
  template: `
  <app-return-btn (click)="setSection('main')" />

  <div class="main-container">
    <h2>Mon profil</h2>
    <div class="username-container">
      <h3>Username</h3>
    </div>

    <div class="profile-grid">
      <div class="profile-item full">
        <div class="profile-label">Début du coaching</div>
        <div class="profile-value">{{ data().startDate }}</div>
      </div>

      <div class="profile-item">
        <div class="profile-label">Semaine</div>
        <div class="profile-value">{{ data().week }}</div>
      </div>

      <div class="profile-item">
        <div class="profile-label">Phase</div>
        <div class="profile-value">{{ data().phase }}</div>
      </div>

      <div class="profile-item full">
        <div class="profile-label">Score santé</div>
        <div class="profile-value">{{ data().healthScore }}</div>
      </div>
    </div>

    <div class="profile-health-bar-wrapper">
      <div class="health-bar-container">
        <div class="health-bar"></div>
        <div class="health-bar-text">0 / 100</div>
      </div>
    </div>
  </div>
  `,
  styles: `
  .main-container {
    margin-top: 12px;
    padding: 14px;
    background: #eef4ff;
    border-radius: 16px;
    border: 1px solid var(--line);
    box-shadow: 0 8px 20px rgba(0, 0, 0, .05);
  }
  h2 {
    margin: 0;
    text-align: center;
    font-size: 18px;
    font-weight: 800;
  }
  .username-container {
    display: flex;
    justify-content: center;
    margin: 12px 0;
  }
  .username-container h3 {
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    padding: 6px 10px;
    border-radius: 12px;
    background: #e8f4ff;
    color: #2d2f36;
    border: 1px solid var(--line);
  }
  .profile-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 4px;
  }
  .profile-item {
    background: rgba(220, 235, 255, 0.7);
    border: 1px solid rgba(180, 210, 255, 0.8);
    border-radius: 12px;
    backdrop-filter: blur(6px);
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
  }
  .profile-item.full {
    grid-column: 1 / -1;
  }
  .profile-label {
    font-size: 11px;
    color: var(--muted);
    font-weight: 600;
    margin-bottom: 4px;
  }
  .profile-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    text-transform: uppercase;
  }
  .profile-health-bar-wrapper {
    margin-top: 12px;
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .health-bar-container {
    position: relative;
    width: 100%;
    max-width: 260px;
    height: 14px;
    background: #e5e7eb;
    border-radius: 20px;
    overflow: hidden;
  }
  .health-bar {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #4ade80, #22c55e, #15803d);
    border-radius: 20px;
    transition: width 0.5s ease-in-out;
  }
  .health-bar-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    pointer-events: none;
  }`
})
export class Profile {
  @Input() section: string = '';
  @Output() sectionChange: EventEmitter<string> = new EventEmitter<string>();
  data = signal<any>({ name: '—', startDate: '—', week: '—', phase: '—', age: '—', healthScore: 0 });

  async ngOnInit() {
    const response = await loadProfileData();
    console.log('Profile data loaded:', response);
  }

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }
}
