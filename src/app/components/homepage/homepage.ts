import { Component } from '@angular/core';
import { Main } from "./main/main";
import { Training } from "./training/training";
import { Nutrition } from "./nutrition/nutrition";
import { Review } from "./review/review";

@Component({
  selector: 'app-homepage',
  imports: [Main, Training, Nutrition, Review],
  template: `
    <div>
      @if (section === 'main') {
      <app-homepage-main [section]='section' (sectionChange)="setSection($event)" />
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

  setSection(newSection: string) {
    this.section = newSection;
  }
}
