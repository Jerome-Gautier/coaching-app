import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../data';
import { LoadingBtn } from "../../../loading-btn/loading-btn";

@Component({
  selector: 'app-question-card',
  imports: [LoadingBtn],
  template: `
    <div class="review-card-container">
      <h2>{{ question.label }}</h2>
      <p class="error-text">{{ error }}</p>
      @if (question.type === 'select') {
      <select [value]="value" (change)="value = $any($event.target).value">
        <option value="" disabled selected>Choisir une option</option>
        @for (option of question.options; track $index) {
        <option [value]="option" [selected]="option === value">{{ option }}</option>
        }
      </select>
      } @else if (question.type === 'text') {
      <input [type]="question.type" [step]="question.step" [value]="value" (input)="value = $event.target.value" />
      } @else if (question.type === 'number') {
      <input
        [type]="question.type"
        [step]="question.step"
        [min]="question.min || null"
        [value]="value"
        (input)="value = $event.target.value"
      />
      } @else {
      <input [type]="question.type" [step]="question.step" [value]="value" (input)="value = $event.target.value" />
      }
      @if (isLoading) {
        <app-loading-btn />
      } @else {
        <button class="primary-btn" (click)="submitAnswer()" [disabled]="isLoading">Valider</button>
      }
      

      <div class="question-footer">
        <div class="question-progress-bar">
          <div
            class="question-progress-bar-fill"
            [style.width.%]="((this.step - 1) / 10) * 100"
          ></div>
        </div>
        <div class="question-progress-text">Question {{ this.step }} sur 10</div>
      </div>
    </div>
  `,
  styles: `
  .review-card-container {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 14px;
    margin-top: 12px;
    padding: 14px 14px 16px;
    text-align: center;
    color: var(--text);
    box-shadow: 0 8px 20px rgba(0, 0, 0, .05);
  }
  .review-card-container h2 {
    font-size: 17px;
    margin: 10px 0;
    color: var(--text);
  }
  .review-card-container select,
  .review-card-container input[type="text"],
  .review-card-container input[type="time"],
  .review-card-container input[type="number"] {
    max-width: 220px;
    width: 100%;
    text-align: center;
    padding: 12px;
    margin: 10px 0;
    border-radius: 10px;
    border: 1px solid var(--line);
    background: #f9fafc;
    color: var(--text);
    font-size: 16px;
  }
  .review-card-container .primary-btn {
    width: 70%;
  }
  .review-card-container .error-text {
    color: #ff4d4f;
  }
  .question-footer {
    margin-top: 20px;
  }
  .question-progress-bar {
    width: 100%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 6px;
  }
  .question-progress-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #4da6ff, #6366f1);
    transition: width 0.3s ease-out;
  }`,
})
export class QuestionCard {
  @Input() isLoading: boolean = false;
  @Input({ required: true }) question!: Question;
  @Input() value: any;
  @Input() step!: number;
  @Output() answer = new EventEmitter<{ col: string; value: any }>();

  error: string = '';

  constructor() {
    effect(() => {
      console.log(this.value);
    })
  }

  submitAnswer() {
    if (this.question.validate(this.value)) {
      this.error = '';
      this.answer.emit({ col: this.question.col, value: this.value });
    } else {
      this.error = 'Valeur invalide, veuillez réessayer.';
    }
  }
}
