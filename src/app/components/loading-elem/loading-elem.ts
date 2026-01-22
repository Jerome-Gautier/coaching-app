import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-elem',
  imports: [],
  template: `
    <div class="loading" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <div class="dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <span class="message">{{ message }}</span>
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; }
    .loading {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      color: #333;
    }

    /* Spinner */
    .spinner {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 4px solid rgba(0,0,0,0.08);
      border-top-color: #7b61ff;
      animation: spin 1s linear infinite;
      box-sizing: border-box;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Pulsing dots */
    .dots {
      display: inline-flex;
      gap: 6px;
      align-items: flex-end;
      height: 18px;
    }
    .dots span {
      display: block;
      width: 8px;
      height: 8px;
      background: #7b61ff;
      border-radius: 50%;
      transform-origin: center;
      animation: jump 0.8s infinite ease-in-out;
    }
    .dots span:nth-child(2) { animation-delay: 0.12s; }
    .dots span:nth-child(3) { animation-delay: 0.24s; }
    @keyframes jump {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.85; }
      40% { transform: translateY(-8px); opacity: 1; }
    }

    .message {
      font-size: 14px;
      line-height: 1;
      white-space: nowrap;
    }

    /* Small screens: reduce sizes */
    @media (max-width: 420px) {
      .spinner { width: 28px; height: 28px; border-width: 3px; }
      .dots span { width: 6px; height: 6px; }
      .message { font-size: 13px; }
    }
  `,
})
export class LoadingElem {
  @Input() message: string = '';
}
