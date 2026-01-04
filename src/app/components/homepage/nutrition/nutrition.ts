import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReturnBtn } from "../../return-button/return-btn";

@Component({
  selector: 'app-nutrition',
  imports: [ReturnBtn],
  template: `
  <app-return-btn (click)="setSection('main')" />
    <div class="main-container">
      <h2>Programme nutrition</h2>
    </div>
  `,
  styles: `
  .main-container h2 {
    width: 100%;
    margin: 0 auto 16px auto;
    background: linear-gradient(135deg, #6EE7FFcc, #7DFCC2cc);
    color: #0f172a;
    font-size: 20px;
    font-weight: 800;
    text-align: center;
    padding: 14px 0;
    border-radius: 14px;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
  }`,
})
export class Nutrition {
  @Input() section: string = '';
  @Output() sectionChange = new EventEmitter<string>();

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }
}
