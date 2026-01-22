import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { NgxEchartsDirective  } from 'ngx-echarts';
import { ReturnBtn } from "../../return-button/return-btn";
import { loadChart } from '../../../../utils/utils';
import { LoadingElem } from "../../loading-elem/loading-elem";
import * as chartOptions from './options';


@Component({
  selector: 'app-chart',
  imports: [NgxEchartsDirective, ReturnBtn, LoadingElem],
  template: `
    <app-return-btn (click)="setSection('main')" />

    <div class="chart-container">
      @if (rawData() && !isLoading()) {
        <div class="card-header">
          <h2>{{ title() }}</h2>
          <span class="lastValue-badge">
            @if (section === "energy") {
              {{ values()[values().length - 1] }} / 5
            } @else if (section === "sleep") {
              {{ formattedTime(values()[values().length - 1]) }}   
            } @else if (section === "weights"){
              {{ values()[values().length - 1] }} kg              
            } @else if (section === "steps") {
              {{ values()[values().length - 1] }} pas
            }
          </span>
        </div>
        <div echarts [options]="chartOptions()" class="echarts-canvas"></div>
      } @else if (isLoading()) {
        <app-loading-elem />
      } @else if (!isLoading() && error()) {
        <p>Erreur lors de la connexion: {{ error() }}</p>
      }
    </div>
  `,
  styles: `
  .chart-container {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .05);
  }
  .echarts-canvas {
    display: block;
    height: 280px;
    min-height: 180px;
    box-sizing: border-box;
  }
  .card-header {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
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
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 999px;
    background: #e8f4ff;
    color: #2d2f36;
    border: 1px solid var(--line);
  }`,
})
export class Chart {
  @Input() section: string = '';
  @Output() sectionChange: EventEmitter<string> = new EventEmitter<string>();
  rawData = signal<any>(null);
  error = signal<any>(null);
  chartOptions = computed(() => {
    return chartOptions.chartOptionsMap[this.section](this.dates(), this.values());
  });
  isLoading = signal<boolean>(false);
  formattedTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    const mm = String(m).padStart(2, '0');
    console.log('Formatted time:', `${h}h${mm}`);
    return `${h}h${mm}`;
  }

  title = computed(() => {
    switch (this.section) {
      case 'sleep': return 'Sommeil (durée)';
      case 'weights': return 'Évolution du poids';
      case 'steps': return 'Nombre de pas';
      case 'energy': return 'Énergie';
      default: return '';
    }
  })
  dates = computed(() => this.rawData().map((d: any) => d.date));
  values = computed(() => this.rawData().map((d: any) => {
    let valueName = "";
    switch (this.section) {
      case 'sleep': valueName ='sleep'; break;
      case 'weights': valueName = 'weight'; break;
      case 'steps': valueName = 'steps'; break;
      case 'energy': valueName = 'energy'; break;
    }
    return d[valueName];
  }));

  async ngOnInit() {
    this.isLoading.set(true);
    const response = await loadChart(this.section);

    if (response.success) {
      this.rawData.set(response.data);
    } else {
      console.error('Failed to load Sleep chart data:', response.message);
      this.error.set(response.message);
    }
    this.isLoading.set(false);
  }

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }
}
