import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-homepage-main',
  imports: [],
  template: `
    <div class="inner-container">
      <div class="recap-container">
        <div class="today-date-container">
          <p>Date: {{ todayDate }}</p>
        </div>

        <div class="recap-header">
          <div class="recap-title-wrapper">
            <p class="recap-logo">📊</p>
            <div>
              <h2 class="recap-title">Résumé d'hier</h2>
              <p class="recap-subtitle">Un coup d'oeil sur ta dernière journée</p>
            </div>
          </div>
          <div class="recap-date">
            <p>{{ yesterdayDate }}</p>
          </div>
        </div>

        <div class="recap-grid">
          <div class="recap-grid-item">
            <div class="recap-labels">
              <span class="recap-icon">😴</span>
              <p>sommeil</p>
            </div>
            <p class="recap-value">{{ data.sleep }}</p>
          </div>

          <div class="recap-grid-item">
            <div class="recap-labels">
              <span class="recap-icon">⚖️</span>
              <p>poids</p>
            </div>
            <p class="recap-value">{{ data.weight }}</p>
          </div>

          <div class="recap-grid-item">
            <div class="recap-labels">
              <span class="recap-icon">👟</span>
              <p>pas</p>
            </div>
            <p class="recap-value">{{ data.steps }}</p>
          </div>

          <div class="recap-grid-item">
            <div class="recap-labels">
              <span class="recap-icon">⚡</span>
              <p>énergie</p>
            </div>
            <p class="recap-value">{{ data.energy }}</p>
          </div>
        </div>
      </div>

      <div class="review-pannel">
        <button class="primary-btn" (click)="setSection('review')">Bilan du jour</button>
        <button class="primary-btn" (click)="setSection('training')">Training</button>
        <button class="primary-btn" (click)="setSection('nutrition')">Nutrition</button>
      </div>
    </div>
  `,
  styles: `
    .recap-container {
      margin-top: 10px;
      margin-bottom: 28px;
      padding: 16px 16px 12px 16px;
      border-radius: 18px;
      background: linear-gradient(135deg, #6EE7FF, #7DFCC2);
      color: #0f172a;
      border: none;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.25) inset;
    }
    .today-date-container {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 6px;
      padding-left: 4px;
    }
    .today-date-container p {
      font-size: 11px;
      font-weight: 400;
      padding: 6px 10px;
      background: rgba(255, 255, 255, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.55);
      color: #0f172a;
      border-radius: 8px;
      backdrop-filter: blur(6px);
    }
    .recap-container .recap-header {
       display: inline-flex;
       justify-content: space-between;
       align-items: center;
       gap: 20px;
       width: 100%;
       margin-bottom: 12px;
    }
    .recap-container .recap-title-wrapper .recap-title {
      font-size: 16px;
      font-weight: 700;
      margin: 4px 0
    }
    .recap-container .recap-title-wrapper .recap-subtitle {
      opacity: 0.75;
      font-size: 11px;
    }
    .recap-container .recap-header .recap-date {
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.35);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(255, 255, 255, 0.55);
    }
    .recap-title-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .recap-grid {
      margin-top: 10px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .recap-grid .recap-grid-item {
      padding: 12px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .recap-grid .recap-grid-item .recap-labels {
      font-size: 11px;
      opacity: 0.8;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-transform: capitalize;
    }
    .recap-grid .recap-grid-item .recap-value {
      font-size: 16px;
      font-weight: 700;
      text-align: center;
    }
    .review-pannel {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }`,
})
export class Main {
  @Input() data!: { date: string; sleep: string; weight: string; steps: string; energy: string };
  todayDate: string = this.formatDate(new Date());
  yesterdayDate: string = this.formatDate(new Date(Date.now() - 86400000));

  private formatDate(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  @Input() section: string = '';
  @Output() sectionChange = new EventEmitter<string>();

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }
}