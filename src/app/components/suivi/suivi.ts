import { Component } from '@angular/core';
import { Main } from "./main/main";
import { Profile } from "./profile/profile";
import { Sleep } from "./sleep/sleep";
import { Weight } from "./weight/weight";
import { Steps } from "./steps/steps";
import { Energy } from "./energy/energy";
import { Todolist } from "./todolist/todolist";

@Component({
  selector: 'app-suivi',
  imports: [Main, Profile, Sleep, Weight, Steps, Energy, Todolist],
  template: `
  @if (section === 'main') {
    <app-suivi-main [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'profile') {
    <app-suivi-profile [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'sleep') {
    <app-suivi-sleep [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'weight') {
    <app-suivi-weight [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'steps') {
    <app-suivi-steps [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'energy') {
    <app-suivi-energy [section]="section" (sectionChange)="setSection($event)" />
  } @else if (section === 'todolist') {
    <app-suivi-todolist [section]="section" (sectionChange)="setSection($event)" />
  }
   `,
})
export class Suivi {
  section: string = 'main';

  setSection(newSection: string) {
    this.section = newSection;
    console.log('Suivi section changed to:', newSection);
  }
}
