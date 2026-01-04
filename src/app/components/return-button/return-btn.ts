import { Component } from '@angular/core';

@Component({
  selector: 'app-return-btn',
  imports: [],
  template: ` <button class="return-btn">⬅️ Retour</button> `,
  styles: `
    .return-btn {
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
    }`,
})
export class ReturnBtn {}