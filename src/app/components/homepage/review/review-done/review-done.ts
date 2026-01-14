import { Component, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-review-done',
  imports: [],
  template: `
    <div id="donePanel" class="done-card card panel-anim">
        <div class="done-emoji">🔥</div>
        <h2 class="done-title">C’est tout pour aujourd’hui</h2>
        <p class="done-subtitle">Tu as complété ton bilan du jour. Beau travail 👌</p>

        <div class="done-chip">Bilan du jour enregistré</div>

        <p class="done-next">Reviens demain pour continuer ta progression.</p>

        <button class="primary-btn" (click)="goToSection('main')">
          ← Retour à l’accueil
        </button>
      </div>
  `,
  styles: `
  .done-card {
    text-align: center;
    padding: 20px 16px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 14px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .05);
    text-align: center;
  }
  .done-emoji {
    font-size: 32px;
    margin-bottom: 6px;
  }
  .done-title {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: var(--text);
  }
  .done-subtitle {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    margin: 6px 0 10px;
    font-size: 14px;
    color: var(--muted);
  }
  .done-chip {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    display: inline-block;
    margin-top: 4px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    background: #ecfdf3;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }
  .done-next {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    margin: 16px 0;
  }`,
})
export class ReviewDone {
  @Input() sectionChange!: EventEmitter<string>;
  
  goToSection(section: string) {
    this.sectionChange.emit(section);
  }
}
