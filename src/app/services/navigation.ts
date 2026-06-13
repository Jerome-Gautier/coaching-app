// services/navigation.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private currentSectionSubject = new BehaviorSubject<string>('accueil');
  currentSection$ = this.currentSectionSubject.asObservable();

  get currentSection(): string {
    return this.currentSectionSubject.value;
  }

  goToSection(section: string) {
    this.currentSectionSubject.next(section);
  }
}