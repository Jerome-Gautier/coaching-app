import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReturnBtn } from '../../return-button/return-btn';
import { sendBulk, todayFR } from '../../../../utils/utils';
import { QuestionCard } from './question-card/question-card';
import { questionsList } from './data';
import { ReviewDone } from "./review-done/review-done";

@Component({
  selector: 'app-review',
  imports: [ReturnBtn, QuestionCard, ReviewDone],
  template: `
    @if (!inProgress() && !completed()) {
    <app-return-btn (click)="setSection('main')" />
    } @else if (inProgress() && !completed()) {
    <button class="prev-btn" (click)="previousQuestion()">← Modifier la réponse précédente</button>
    }
    <div class="main-container">
      @if (!inProgress() && !completed()) {
      <button class="primary-btn" (click)="startReview()">Commencer</button>
      } @else if (inProgress()) { @if (cardVisible()) {
      <app-question-card
        [question]="currentQuestion()"
        [value]="bulk[step() - 1]?.value"
        [step]="step()"
        [isLoading]="isLoading()"
        (answer)="advanceReview($event)"
      />
      } } @else if (this.completed()) {
      <app-review-done [sectionChange]="sectionChange" />
      }
    </div>
  `,
  styles: `
  .prev-btn {
    background: #e5e7eb;
    color: var(--text);
    border: 1px solid var(--line);
    padding: 14px;
    margin-bottom: 12px;
    border-radius: 12px;
    font-weight: 600;
    width: 100%;
    font-size: 16px;
    cursor: pointer;
  }
`,
})
export class Review {
  @Input() section: string = '';
  @Output() sectionChange = new EventEmitter<string>();

  questionsList = questionsList;
  answers: { col: string; value: any }[] = [];

  currentQuestion = computed(() => {
    return this.questionsList[this.step() - 1];
  });

  date: string = '';
  sheet_tab: string = 'journal';
  bulk: { col: string; value: any }[] = [];

  isLoading = signal(false);
  cardVisible = signal(true);
  inProgress = signal(false);
  completed = signal(false);
  step = signal(1);

  setSection(newSection: string) {
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }

  startReview() {
    this.date = todayFR();
    this.inProgress.set(true);
    this.bulk = this.questionsList.map((item) => ({ col: item.col, value: '' }));
  }

  previousQuestion() {
    const prevStep = this.step() - 1;
    if (prevStep < 1) {
      return;
    }
    this.step.set(prevStep);
    this.resetCardVisibility();
  }

  advanceReview(questionObj: { col: string; value: any }) {
    this.bulk[this.step() - 1] = questionObj;

    const nextStep = this.step() + 1;

    if (nextStep > 10) {
      this.isLoading.set(true);
      sendBulk({ date: this.date, sheet: this.sheet_tab, bulk: this.bulk }, (err: any) => {
        if (err) {
          alert('Envoi au Google Sheet : ' + err);
        } else {
          this.inProgress.set(false);
          this.completed.set(true);
        }
        this.isLoading.set(false);
      });
    } else {
      this.step.set(nextStep);
      this.resetCardVisibility();
    }
  }

  resetCardVisibility() {
    this.cardVisible.set(false);
    setTimeout(() => {
      this.cardVisible.set(true);
    }, 100);
  }
}