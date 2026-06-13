import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CheckinData } from '../../models/checkin_models';

@Injectable({ providedIn: 'root' })
export class DailyCheckinsService {
  private readonly workoutMap: Record<string, string> = {
    BOF: 'poor',
    MOYEN: 'okay',
    BIEN: 'good',
    SUPER: 'excellent',
    REPOS: 'rest_day',
  };

  constructor(private http: HttpClient) {}

  async getCheckinByDate(userId: number, isoDate: string): Promise<CheckinData | null> {
    try {
      return await lastValueFrom(
        this.http.get<CheckinData>(`/api/daily-checkins/${userId}?date=${isoDate}`)
      );
    } catch (err: any) {
      if (err?.status === 404) return null;
      throw err;
    }
  }

  async getCheckinsByDateRange(userId: number, startIsoDate: string, endIsoDate: string): Promise<CheckinData[]> {
    try {
      return await lastValueFrom(
        this.http.get<CheckinData[]>(`/api/daily-checkins/${userId}?start_date=${startIsoDate}&end_date=${endIsoDate}`)
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
 
    if (payload.id && payload.checked_in_at) {
      const body = {
        id: payload.id,
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
      await lastValueFrom(
        this.http.put(`/api/daily-checkins/${payload.id}`, body)
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
      await lastValueFrom(
        this.http.post(`/api/daily-checkins`, body)
      );
    }
  }
}
