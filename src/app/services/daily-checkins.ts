import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CheckinData } from '../../models/checkin_models';
import { ApiConfigService } from './api-config.service';

@Injectable({ providedIn: 'root' })
export class DailyCheckinsService {
  private readonly workoutMap: Record<string, string> = {
    BOF: 'poor',
    MOYEN: 'okay',
    BIEN: 'good',
    SUPER: 'excellent',
    REPOS: 'rest_day',
  };

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  async getCheckinByDate(userId: number, isoDate: string): Promise<CheckinData | null> {
    const url = this.apiConfig.getFullUrl(`/daily-checkins/${userId}`);
    try {
      return await lastValueFrom(
        this.http.get<CheckinData | null>(url, {
          params: new HttpParams().set('date', isoDate),
        })
      );
    } catch (err: any) {
      if (err?.status === 404) return null;
      throw err;
    }
  }

  async getCheckinsByDateRange(userId: number, startIsoDate: string, endIsoDate: string): Promise<CheckinData[]> {
    const url = this.apiConfig.getFullUrl(`/daily-checkins/${userId}`);
    try {
      return await lastValueFrom(
        this.http.get<CheckinData[]>(url, {
          params: new HttpParams()
            .set('start_date', startIsoDate)
            .set('end_date', endIsoDate),
        })
      );
    } catch (err: any) {
      if (err?.status === 404) return [];
      throw err;
    }
  }

  async sendCheckin(payload: CheckinData): Promise<void> {
    const userStr = localStorage.getItem('auth_user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user?.id) throw new Error('No authenticated user');
 
    if (payload.id !== null) {
      const body = {
        user_id: user.id,
        checkin_date: payload.checkin_date,
        weight: payload.weight,
        sleep_rating: payload.sleep_rating,
        sleep_start_time: payload.sleep_start_time,
        sleep_end_time: payload.sleep_end_time,
        energy_rating: payload.energy_rating,
        diet_rating: payload.diet_rating,
        digestion_rating: payload.digestion_rating,
        workout_rating: payload.workout_rating ? this.workoutMap[payload.workout_rating] || null : null,
        steps: payload.steps,
      }
      const url = this.apiConfig.getFullUrl(`/daily-checkins/${payload.id}`);
      await lastValueFrom(
        this.http.put(url, body)
      );
      return;
    } else {
      const body = {
        user_id: user.id,
        checkin_date: payload.checkin_date,
        weight: payload.weight,
        sleep_rating: payload.sleep_rating,
        sleep_start_time: payload.sleep_start_time,
        sleep_end_time: payload.sleep_end_time,
        energy_rating: payload.energy_rating,
        diet_rating: payload.diet_rating,
        digestion_rating: payload.digestion_rating,
        workout_rating: payload.workout_rating ? this.workoutMap[payload.workout_rating] || null : null,
        steps: payload.steps,
      }
      const url = this.apiConfig.getFullUrl('/daily-checkins');
      await lastValueFrom(
        this.http.post(url, body)
      );
    }
  }
}
