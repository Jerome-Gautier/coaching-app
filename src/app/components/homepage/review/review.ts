import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReturnBtn } from "../../return-button/return-btn";

@Component({
  selector: 'app-review',
  imports: [ReturnBtn],
  template: `
    <app-return-btn (click)="setSection('main')" />

    <div class="main-container">
      <button class="primary-btn">Commencer</button>
    </div>
  `,
  styles: ``,
})
export class Review {
  @Input() section: string = '';
  @Output() sectionChange = new EventEmitter<string>();

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }
}
