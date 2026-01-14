// ...existing code...
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-btn',
  imports: [],
  template: `
    <button class="primary-btn loading" disabled aria-busy="true" title="Chargement">
      <span class="spinner" aria-hidden="true"></span>
      <span class="label">Envoie des données…</span>
    </button>
  `,
  styles: `
    .primary-btn.loading {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px 16px;
      border-radius: 10px;
      cursor: default;
      opacity: 0.95;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid rgba(0,0,0,0.12);
      border-top-color: rgba(0,0,0,0.6);
      box-sizing: border-box;
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .primary-btn.loading .label {
      font-weight: 600;
    }
  `,
})
export class LoadingBtn {}