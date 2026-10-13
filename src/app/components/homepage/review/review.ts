import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ReturnBtn } from '../../return-button/return-btn';
import { todayFR, formatToFrenchDayMonth } from '../../../../utils/dateUtils';
import { DailyCheckinsService } from '../../../services/daily-checkins';
import { QuestionCard } from './question-card/question-card';
import { bulkInitialState, normalizeForEditing, questionsList } from './data';
import { CheckinData } from '../../../../models/checkin_models';
import { ReviewDone } from './review-done/review-done';
import { LoadingBtn } from '../../loading-btn/loading-btn';
import { NavigationService } from '../../../services/navigation';

@Component({
  selector: 'app-review',
  imports: [ReturnBtn, QuestionCard, ReviewDone, LoadingBtn],
  template: `
    <div class="main-container">
      @if (dailyReviewDone()) {
        <app-review-done (sectionChange)="setSection($event)" />
      }
      @if (showInitialView()) {
        <app-return-btn (click)="setSection('main')" />
      } @else if (showInProgress()) {
        <button class="prev-btn" (click)="previousQuestion()">
          {{ step() === 1 ? '← Revenir aux Bilans' : '← Modifier la réponse précédente' }}
        </button>
      }

      <div class="main-container">
        @if (showInitialView()) {
          @if (!dataFetched()) {
            <app-loading-btn />
          } @else {
            <button class="primary-btn" (click)="startReview(todayCheckin())">
              {{
                todayCheckin()['checked_in_at'] ? 'Modifier le Bilan du jour' : 'Commencer le Bilan du jour'
              }}
            </button>
          }          
        } @else if (showInProgress()) {
          <h1 class="review-title-day">{{ frenchDayMonth() }}</h1>

          @if (cardVisible()) {
            <app-question-card
              [question]="currentQuestion()"
              [value]="bulk()[currentQuestion().name]"
              [step]="step()"
              [isLoading]="isLoading()"
              (answer)="advanceReview($event)"
            />
          }
        }
        @if (!inProgress()) {
          <div class="last-week-data">
            <h3>Bilans des 7 jours précédents</h3>
            @if (lastWeekData().length) {
              @for (data of lastWeekData(); track data.checkin_date) {
                <button
                  class="data-entry-btn"
                  [class.completed]="!!data.checked_in_at"
                  [class.missing]="!data.checked_in_at"
                  (click)="onDayClick(data)"
                >
                  <span class="date">{{ data.checkin_date }}</span>

                  @if (data.checked_in_at) {
                    <span class="status">✅ Bilan complété</span>
                  } @else {
                    <span class="status">❌ Aucun Bilan</span>
                  }
                </button>
              }
            } @else if (weekDataLoading()) {
              <app-loading-btn />
            }
          </div>
        }
      </div>
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

    .last-week-data {
      margin-top: 24px;
    }

    .review-title-day {
      text-align: center;
    }

    .last-week-data h3 {
      margin-bottom: 16px;
      margin-left: 4px;
      font-size: 18px;
    }

    .data-entry-btn {
      width: 100%;
      padding: 16px 18px;
      margin-bottom: 10px;
      border-radius: 12px;
      border: none;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .data-entry-btn .date {
      font-weight: 600;
    }

    .data-entry-btn.completed {
      background: #d4f4e6;
      color: #166534;
      border: 1px solid #86efac;
    }

    .data-entry-btn.missing {
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fca5a5;
    }

    .data-entry-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `,
})
export class Review {
  private dailyCheckins = inject(DailyCheckinsService);
  private navigation = inject(NavigationService);

  @Input() section: string = '';
  @Output() sectionChange = new EventEmitter<string>();

  // ==================== Signals ====================
  bulk = signal<CheckinData>(bulkInitialState);
  lastWeekData = signal<CheckinData[]>([]);
  todayCheckin = signal<CheckinData>({
    id: null,
    user_id: null,
    checkin_date: '',
    checked_in_at: null,
    weight: null,
    sleep_rating: null,
    sleep_start_time: null,
    sleep_end_time: null,
    sleep_duration_minutes: null,
    energy_rating: null,
    diet_rating: null,
    digestion_rating: null,
    workout_rating: null,
    steps: null,
  });

  isLoading = signal(false);
  dataFetched = signal(false);
  weekDataLoading = signal(false);
  dailyReviewDone = signal(false);
  frenchDayMonth = signal('');
  cardVisible = signal(true);
  cardKey = signal(0);
  inProgress = signal(false);

  step = signal(1);

  // ==================== Computed ====================
  currentQuestion = computed(() => questionsList[this.step() - 1]);

  showInitialView = computed(() => !this.inProgress());
  showInProgress = computed(() => this.inProgress());

  // ==================== Class properties ====================
  date = '';

  // ==================== Lifecycle ====================
  async ngOnInit() {
    this.weekDataLoading.set(true);
    await this.loadRecentCheckins();
    this.weekDataLoading.set(false);
  }

  // ==================== Private methods ====================
  private async loadRecentCheckins() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 7);

    const userStr = localStorage.getItem('auth_user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user?.id) return;

    try {
      const response: any[] = await this.dailyCheckins.getCheckinsByDateRange(
        user.id,
        startDate.toISOString().slice(0, 10),
        today.toISOString().slice(0, 10),
      );

      const todayStr = today.toISOString().slice(0, 10);

      if (response.some((item: any) => item.checkin_date === todayStr)) {
        const todayData = response.find((item: any) => item.checkin_date === todayStr);
        this.todayCheckin.set(todayData);
      } else {
        this.todayCheckin.set({
          id: null,
          user_id: null,
          checkin_date: todayStr,
          checked_in_at: null,
          weight: null,
          sleep_rating: null,
          sleep_start_time: null,
          sleep_end_time: null,
          sleep_duration_minutes: null,
          energy_rating: null,
          diet_rating: null,
          digestion_rating: null,
          workout_rating: null,
          steps: null,
        });
      }

      const previous7Dates = this.generatePrevious7Dates();

      const merged = previous7Dates.map((date) => {
        const existing = response.find((item: any) => item.checkin_date === date);
        return (
          existing || {
            id: null,
            user_id: null,
            checkin_date: date,
            checked_in_at: null,
            weight: null,
            sleep_rating: null,
            sleep_start_time: null,
            sleep_end_time: null,
            sleep_duration_minutes: null,
            energy_rating: null,
            diet_rating: null,
            digestion_rating: null,
            workout_rating: null,
            steps: null,
          }
        );
      });

      this.lastWeekData.set(merged);
    } catch (e) {
      console.error('Failed to load check-ins', e);

      this.lastWeekData.set(
        this.generatePrevious7Dates().map((date) => ({
          id: null,
          user_id: null,
          checkin_date: date,
          checked_in_at: null,
          weight: null,
          sleep_rating: null,
          sleep_start_time: null,
          sleep_end_time: null,
          sleep_duration_minutes: null,
          energy_rating: null,
          diet_rating: null,
          digestion_rating: null,
          workout_rating: null,
          steps: null,
        })),
      );
      this.todayCheckin.set({
        id: null,
        user_id: null,
        checkin_date: todayFR(),
        checked_in_at: null,
        weight: null,
        sleep_rating: null,
        sleep_start_time: null,
        sleep_end_time: null,
        sleep_duration_minutes: null,
        energy_rating: null,
        diet_rating: null,
        digestion_rating: null,
        workout_rating: null,
        steps: null,
      });
    }

    this.dataFetched.set(true);
  }

  private generatePrevious7Dates(): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
  }

  private resetCardVisibility() {
    this.cardVisible.set(false);
    this.cardKey.update((k) => k + 1);

    // Small delay to allow Angular to destroy/recreate the card
    setTimeout(() => {
      this.cardVisible.set(true);
    }, 0);
  }

  // ==================== Public methods ====================
  onDayClick(data: CheckinData) {
    if (data?.checkin_date) {
      this.startReview(data);
    }
  }

  setSection(newSection: string) {
    const section = newSection;
    this.navigation.goToSection(section);
    this.section = newSection;
    this.sectionChange.emit(newSection);
  }

  startReview(data: CheckinData) {
    this.step.set(1);
    this.cardVisible.set(true);
    this.isLoading.set(false);
    this.inProgress.set(true);

    if (data?.checkin_date) {
      this.frenchDayMonth.set(formatToFrenchDayMonth(data['checkin_date']));
      this.bulk.set({ ...data });

      const normalized = normalizeForEditing({ ...data });
      this.bulk.set(normalized);
    }
  }

  previousQuestion() {
    const prevStep = this.step() - 1;

    if (prevStep < 1) {
      this.inProgress.set(false);
      this.step.set(1);
      this.bulk.set({ ...bulkInitialState });
      return;
    }

    this.step.set(prevStep);
    //this.resetCardVisibility();
  }

  advanceReview(questionObj: { name: keyof CheckinData; value: any }) {
    if (!questionObj.name && !questionObj.value) return;
    this.bulk.set({ ...this.bulk(), [questionObj.name]: questionObj.value });

    const nextStep = this.step() + 1;

    if (nextStep > questionsList.length) {
      this.isLoading.set(true);

      this.dailyCheckins
        .sendCheckin(this.bulk())
        .then(() => {
          this.inProgress.set(false);
          this.loadRecentCheckins();
        })
        .catch((err: any) => {
          alert('Erreur : ' + (err?.message || String(err)));
        })
        .finally(() => {
          this.isLoading.set(false);
          this.dailyReviewDone.set(true);
        });
      return;
    }

    this.step.set(nextStep);
    //this.resetCardVisibility();
  }
}
