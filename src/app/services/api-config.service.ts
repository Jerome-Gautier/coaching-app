import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiConfigService {
  private readonly baseUrl = environment.apiBaseUrl;

  get apiUrl(): string {
    return this.baseUrl ? `${this.baseUrl}/api` : '/api';
  }

  // Helper for full URLs
  getFullUrl(endpoint: string): string {
    // endpoint should start with / or not – we normalize
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.apiUrl}${cleanEndpoint}`;
  }
}