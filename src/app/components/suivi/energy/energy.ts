import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReturnBtn } from "../../return-button/return-btn";

@Component({
  selector: 'app-suivi-energy',
  imports: [ReturnBtn],
  template: `
    <app-return-btn (click)="setSection('main')" />
    
    <p>
      energy works!
    </p>
  `,
  styles: ``,
})
export class Energy {
  @Input() section: string = '';
  @Output() sectionChange: EventEmitter<string> = new EventEmitter<string>();

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }
}