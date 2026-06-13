import { Component, computed, effect, EventEmitter, Input, Output, signal } from '@angular/core';
import { NgxEchartsDirective  } from 'ngx-echarts';
import { ReturnBtn } from "../../return-button/return-btn";
import { LoadingElem } from "../../loading-elem/loading-elem";
import * as chartOptions from './options';


@Component({
  selector: 'app-chart',
  imports: [NgxEchartsDirective, ReturnBtn, LoadingElem],
  template: `
    <app-return-btn (click)="setSection('main')" />

    <div class="chart-container">
      <div class="card-header">
        <h2>{{ title() }}</h2>
        <span class="lastValue-badge">
          @if (!rawData) {
            —
          } @else {
            {{ formatValue(values().slice(-1)[0], section) }}
          }
        </span>
      </div>
      @if (rawData && !isLoading) {
        <div echarts [options]="chartOptions()" class="echarts-canvas"></div>
      } @else if (isLoading) {
        <div class="loading-container">
          <app-loading-elem [size]="96" />
        </div>
      } @else if (!isLoading && error()) {
        <p>Erreur lors de la connexion: {{ error() }}</p>
      }
      <div class="card-avg">
        <div class="summary-title">Moyenne sur les 7 derniers jours</div>
        <p>
          @if (rawData && !isLoading) {
            {{ avgValue() }}
          } @else {
            —
          }
        </p>
      </div>
    </div>
  `,
  styles: `
    .chart-container {
      font-family:
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 12px;
      height: 340px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
    }
    .echarts-canvas {
      display: block;
      height: 280px;
      min-height: 180px;
      box-sizing: border-box;
    }
    .card-header {
      font-family:
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .card-header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
    }
    .card-header .lastValue-badge {
      font-family:
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 999px;
      background: #e8f4ff;
      color: #2d2f36;
      border: 1px solid var(--line);
    }
    .card-avg {
      font-family:
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
      background: #f0fffa;
      border-color: #ccf5e9;
      margin-top: 24px;
      padding: 14px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      background: #ffffff;
      border: 1px solid var(--line);
      border-radius: 14px;
      color: var(--text);
    }
    .card-avg .summary-title {
      font-family:
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
      color: var(--muted);
      font-size: 13px;
      margin-bottom: 6px;
      text-align: center;
    }
    .loading-container {
      width: 100%;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
})
export class Chart {
  @Input() section: string = '';
  @Input() isLoading: boolean = false;
  @Input() rawData: any[] | null = null;
  @Output() sectionChange: EventEmitter<string> = new EventEmitter<string>();

  error = signal<any>(null);

  private getSortedData() {
    if (!this.rawData || this.rawData.length === 0) return { dates: [], values: [] };

    const sorted = [...this.rawData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const dates = sorted.map((d: any) => d.date);

    const values = sorted.map((d: any) => {
      const raw = d[this.getValueKey(this.section)];
      if (raw === null || raw === undefined) {
        return this.section === 'steps' ? 0 : null;
      }
      if (this.section === 'sleep') {
        return this.parseSleep(raw);
      }
      return typeof raw === 'number' ? raw : parseFloat(raw) || 0;
    });

    return { dates, values };
  }

  private getValueKey(section: string): string {
    switch (section) {
      case 'sleep':
        return 'sleep';
      case 'weights':
        return 'weight';
      case 'steps':
        return 'steps';
      case 'energy':
        return 'energy';
      default:
        return '';
    }
  }

  private parseSleep(value: string | number | null | undefined): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;

    const str = String(value).trim();
    const match = str.match(/^(\d+)h(\d+)?$/i);
    if (match) {
      const hours = parseInt(match[1], 10) || 0;
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      return hours + minutes / 60;
    }
    return parseFloat(str) || 0;
  }

  private formatSleep(decimalHours: number): string {
    const h = Math.floor(decimalHours);
    const m = Math.round((decimalHours - h) * 60);
    const mm = String(m).padStart(2, '0');
    return `${h}h${mm}`;
  }

  chartOptions = computed(() => {
    const { dates, values } = this.getSortedData();
    return chartOptions.chartOptionsMap[this.section](dates, values);
  });

  title = computed(() => {
    switch (this.section) {
      case 'sleep':
        return 'Sommeil (durée)';
      case 'weights':
        return 'Évolution du poids';
      case 'steps':
        return 'Nombre de pas';
      case 'energy':
        return 'Énergie';
      default:
        return '';
    }
  });

  dates = computed(() => {
    if (!this.rawData) return [];
    return [...this.rawData].reverse().map((d: any) => d.date);
  });

  values = computed(() =>
    this.rawData
      ? this.rawData.map((d: any) => {
          let valueName = '';
          switch (this.section) {
            case 'sleep':
              valueName = 'sleep';
              break;
            case 'weights':
              valueName = 'weight';
              break;
            case 'steps':
              valueName = 'steps';
              break;
            case 'energy':
              valueName = 'energy';
              break;
          }

          const raw = d[valueName];

          if (raw === null || raw === undefined) {
            return this.section === 'steps' ? 0 : null;
          }
          if (valueName === 'sleep') {
            return this.parseSleep(raw);
          } else {
            return typeof raw === 'number' ? raw : parseFloat(raw) || 0;
          }
        })
      : [],
  );

  avgValue = computed(() => {
    const vals = this.values();
    const last7 = vals.slice(-7);

    // Filter out null/undefined values for average calculation
    const validValues = last7.filter((v): v is number => v !== null && v !== undefined);

    if (validValues.length === 0) {
      return '—';
    }

    const sum = validValues.reduce((acc: number, val: number) => acc + val, 0);
    const avg = sum / validValues.length;
    const avgRounded = Math.round(avg * 100) / 100;

    return this.formatValue(avgRounded, this.section);
  });

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }

  formatValue(value: number | null | undefined, type: string): string {
    if (value === null || value === undefined) {
      return '—';
    }

    if (type === 'sleep') {
      return this.formatSleep(value);
    } else if (type === 'weights') {
      return `${value} kg`;
    } else if (type === 'steps') {
      return `${Math.round(value)} pas`;
    } else if (type === 'energy') {
      return `${value} / 5`;
    } else {
      return 'Error, value type unknown';
    }
  }
}

