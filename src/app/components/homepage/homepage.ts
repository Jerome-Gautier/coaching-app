import { Component, signal } from '@angular/core';
import { Main } from "./main/main";
import { Training } from "./training/training";
import { Nutrition } from "./nutrition/nutrition";
import { Review } from "./review/review";
import { loadYesterdaySummary } from '../../../utils/utils';

@Component({
  selector: 'app-homepage',
  imports: [Main, Training, Nutrition, Review],
  template: `
    <div>
      @if (section === 'main') {
      <app-homepage-main [section]='section' [data]='data()' (sectionChange)="setSection($event)" />
      } @else if (section === 'review') {
        <app-review [section]="section" (sectionChange)="setSection($event)"/>
      } @else if (section === 'training') {
      <app-training [section]="section" (sectionChange)="setSection($event)"/>
      } @else if (section === 'nutrition') {
      <app-nutrition [section]="section" (sectionChange)="setSection($event)"/>
      }
    </div>
  `,
  styles: ``,
})
export class Homepage {
  section: string = 'main';
  data = signal<any>({
    sleep: '_',
    weight: '_',
    steps: '_',
    energy: '_',
  });

  async ngOnInit() {
    const response = await loadYesterdaySummary();
    this.data.set(response);
  }

  setSection(newSection: string) {
    this.section = newSection;
  }

  
}
