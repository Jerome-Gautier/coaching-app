import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { DailyCheckinsService } from '../../../services/daily-checkins';
import { formatDateFR } from '../../../../utils/dateUtils';

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
            <p>{{ this.yesterdayDate() }}</p>
          </div>
        </div>

        <div class="recap-grid">
          <div class="recap-grid-item">
            <div class="recap-labels">
              <span class="recap-icon">😴</span>
              <p>sommeil</p>
            </div>
            <p class="recap-value">{{ data().sleep }}</p>
          </div>

          <div class="recap-grid-item">
            <div class="recap-labels">
              <span class="recap-icon">⚖️</span>
              <p>poids</p>
            </div>
            <p class="recap-value">{{ data().weight }}</p>
          </div>

          <div class="recap-grid-item">
            <div class="recap-labels">
              <span class="recap-icon">👟</span>
              <p>pas</p>
            </div>
            <p class="recap-value">{{ data().steps }}</p>
          </div>

          <div class="recap-grid-item">
            <div class="recap-labels">
              <span class="recap-icon">⚡</span>
              <p>énergie</p>
            </div>
            <p class="recap-value">{{ data().energy }}</p>
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
      background: linear-gradient(135deg, #6ee7ff, #7dfcc2);
      color: #0f172a;
      border: none;
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.22),
        0 0 0 1px rgba(255, 255, 255, 0.25) inset;
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
      margin: 4px 0;
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
    }
  `,
})
export class Main implements OnInit {
  private dailyCheckins = inject(DailyCheckinsService);
  readonly formatDateFR = formatDateFR;

  data = signal({ sleep: '—', weight: '—', steps: '—', energy: '—' });
  checkinDate = signal<string | null>(null);
  todayDate: string = formatDateFR(new Date());
  yesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDateFR(yesterday);
  }

  async ngOnInit() {
    const userStr = localStorage.getItem('auth_user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user?.id) return;

    const isoDate = new Date();
    isoDate.setDate(isoDate.getDate() - 1);
    const isoDateStr = isoDate.toISOString().slice(0, 10);

    try {
      const checkin = await this.dailyCheckins.getCheckinByDate(user.id, isoDateStr);
      if (!checkin) return;

      if (checkin.checkin_date) {
        this.checkinDate.set(this.isoToFR(String(checkin.checkin_date)));
      }

      this.data.set({
        sleep: this.computeSleepLabel(
          checkin.sleep_start_time ?? null,
          checkin.sleep_end_time ?? null,
        ),
        weight: checkin.weight != null ? `${checkin.weight} kg` : '—',
        steps: checkin.steps != null ? checkin.steps.toLocaleString('fr-FR') + ' pas' : '—',
        energy: checkin.energy_rating != null ? `${checkin.energy_rating} / 5` : '—',
      });
    } catch (e) {
      console.error("Failed to load yesterday's check-in", e);
    }
  }

  private isoToFR(iso: string): string {
    const [yyyy, mm, dd] = iso.slice(0, 10).split('-');
    return `${dd}/${mm}/${yyyy}`;
  }

  private computeSleepLabel(start: string | null, end: string | null): string {
    if (!start || !end) return '—';
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / 3_600_000;
    if (diff <= 0 || diff > 24) return '—';
    const hh = Math.floor(diff);
    const mins = Math.round((diff - hh) * 60);
    return `${hh}h${String(mins).padStart(2, '0')}`;
  }

  @Input() section: string = '';
  @Output() sectionChange = new EventEmitter<string>();

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }
}
