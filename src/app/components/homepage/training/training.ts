import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReturnBtn } from "../../return-button/return-btn";

@Component({
  selector: 'app-training',
  imports: [ReturnBtn],
  template: `
  <app-return-btn (click)="setSection('main')" />

  <div class="main-container">
    <div class="menu-container">
      <button class="primary-btn">Programme</button>
      <button class="primary-btn">🧪 Programme test</button>
    </div>
  </div>
  `,
  styles: `
  .menu-container {
    display: flex;
    gap: 12px;
    flex-direction: column;
  }`,
})
export class Training {
  @Input() section: string = '';
  @Output() sectionChange = new EventEmitter<string>();
  
  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }
}
