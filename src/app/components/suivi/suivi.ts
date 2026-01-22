import { Component } from '@angular/core';
import { Main } from "./main/main";
import { Profile } from "./profile/profile";
import { Todolist } from "./todolist/todolist";
import { Chart } from "./chart/chart";

@Component({
  selector: 'app-suivi',
  imports: [Main, Profile, Todolist, Chart],
  template: `
  @if (section === 'main') {
    <app-suivi-main [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'profile') {
    <app-suivi-profile [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'sleep') {
    <app-chart [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'weights') {
    <app-chart [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'steps') {
    <app-chart [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'energy') {
    <app-chart [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'todolist') {
    <app-suivi-todolist [section]="section" (sectionChange)="setSection($event)" />
  }
   `,
})
export class Suivi {
  section: string = 'main';

  setSection(newSection: string) {
    this.section = newSection;
  }
}
