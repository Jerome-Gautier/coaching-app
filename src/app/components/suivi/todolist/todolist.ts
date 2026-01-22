import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReturnBtn } from "../../return-button/return-btn";

@Component({
  selector: 'app-suivi-todolist',
  imports: [ReturnBtn],
  template: `
    <app-return-btn (click)="setSection('main')" />

    <button class="primary-btn" (click)="addItem()">+ Ajouter une tâche</button>

    <div class="todolist-container">
      <h2>To Do List</h2>
      @for (item of todolistItems(); track item) {
        <button class="todolist-item" (click)="removeItem(item)">
          <input type="checkbox" id="task-{{ item }}" name="task-{{ item }}" />
          <label for="task-{{ item }}">{{ item }}</label>
        </button>
      }
    </div>
  `,
  styles: `
  .todolist-container {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 30vh;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 12px;
    margin-top: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .05);
    color: var(--text);    
  }
  .todolist-container h2 {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    font-size: 16px;
    font-weight: 800;
    color: var(--text);
    text-align: center;
  }
  .todolist-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 10px;
    background: #f8f8f8;
  }
  .todolist-item input[type="checkbox"] {
    width: 20px;
    height: 20px;
    padding: 12px;
    margin: 10px 0;
    border-radius: 10px;
    border: 1px solid var(--line);
    background: #f9fafc;
    color: var(--text);
    font-size: 16px;
  }
  .todolist-item label {
    flex: 1;
    font-size: 16px;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    color: var(--text);
    cursor: default;
  }`,
})
export class Todolist {
  @Input() section: string = '';
  @Output() sectionChange: EventEmitter<string> = new EventEmitter<string>();
  todolistItems = signal<string[]>([]);

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }

  addItem() {
    const item = window.prompt('Nouvelle tâche :', '')?.trim()!;
    this.todolistItems.set([...this.todolistItems(), item]);
  }

  removeItem(item: string) {
    this.todolistItems.set(this.todolistItems().filter((i) => i !== item));
  }
}
