import { Component, signal } from '@angular/core';
import { Main } from './main/main';
import { Profile } from './profile/profile';
import { Todolist } from './todolist/todolist';
import { Chart } from './chart/chart';
import { DailyCheckinsService } from '../../services/daily-checkins';

@Component({
  selector: 'app-suivi',
  imports: [Main, Profile, Todolist, Chart],
  template: `
    @if (section === 'main') {
      <app-suivi-main [section]="section" (sectionChange)="setSection($event)" />
    } @else if (section === 'profile') {
      <app-suivi-profile [section]="section" (sectionChange)="setSection($event)" />
    } @else if (section === 'sleep') {
      <app-chart [section]="section" [rawData]="monitoringData().sleep" [isLoading]="isLoading()" (sectionChange)="setSection($event)" />
    } @else if (section === 'weights') {
      <app-chart [section]="section" [rawData]="monitoringData().weight" [isLoading]="isLoading()" (sectionChange)="setSection($event)" />
    } @else if (section === 'steps') {
      <app-chart [section]="section" [rawData]="monitoringData().steps" [isLoading]="isLoading()" (sectionChange)="setSection($event)" />
    } @else if (section === 'energy') {
      <app-chart [section]="section" [rawData]="monitoringData().energy" [isLoading]="isLoading()" (sectionChange)="setSection($event)" />
    } @else if (section === 'todolist') {
      <app-suivi-todolist [section]="section" (sectionChange)="setSection($event)" />
    }
  `,
})
export class Suivi {
  section: string = 'main';

  isLoading = signal<boolean>(false);
  monitoringData = signal<any>({ sleep: null, weight: null, steps: null, energy: null });

  constructor(private dailyCheckins: DailyCheckinsService) {}

  async ngOnInit() {
    this.isLoading.set(true);
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 30);

    const userStr = localStorage.getItem('auth_user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user?.id) {
      console.error('User ID not found in localStorage');
      this.isLoading.set(false);
      return;
    }

    const response = await this.dailyCheckins.getCheckinsByDateRange(
      user.id,
      startDate.toISOString().slice(0, 10),
      today.toISOString().slice(0, 10),
    );

    // Normalize data: one entry per day for the last 30 days
    const fullSleep = this.fillMissingDays(response, 'sleep_duration', null);
    const fullWeight = this.fillMissingDays(response, 'weight', null);
    const fullSteps = this.fillMissingDays(response, 'steps', null);
    const fullEnergy = this.fillMissingDays(response, 'energy_rating', null);

    this.monitoringData.set({
      sleep: fullSleep,
      weight: fullWeight,
      steps: fullSteps,
      energy: fullEnergy
    });

    this.isLoading.set(false);
  }

  private fillMissingDays(data: any[], valueKey: string, defaultValue: any) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 30);

    const dateMap = new Map<string, any>();
    data.forEach((d: any) => {
      dateMap.set(d.checkin_date, d);
    });

    const result: any[] = [];
    let current = new Date(startDate);

    while (current <= today) {
      const dateStr = current.toISOString().slice(0, 10);
      const existing = dateMap.get(dateStr);

      result.push({
        date: dateStr,
        sleep: existing ? existing.sleep_duration : (valueKey === 'sleep_duration' ? defaultValue : undefined),
        weight: existing ? existing.weight : (valueKey === 'weight' ? defaultValue : undefined),
        steps: existing ? existing.steps : (valueKey === 'steps' ? defaultValue : undefined),
        energy: existing ? existing.energy_rating : (valueKey === 'energy_rating' ? defaultValue : undefined),
      });

      current.setDate(current.getDate() + 1);
    }

    return result;
  }

  setSection(newSection: string) {
    this.section = newSection;
  }
}