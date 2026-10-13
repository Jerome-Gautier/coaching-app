export interface Question {
  name: keyof CheckinData;
  label: string;
  type: string;
  step?: string;
  min?: string;
  options?: string[];
  validate: (v: string) => boolean;
}

export interface CheckinData {
  id: number | null;
  user_id: number | null;
  checkin_date: string | null;
  checked_in_at: string | null;
  weight: number | null;
  sleep_rating: number | null;
  sleep_start_time: string | null;
  sleep_end_time: string | null;
  sleep_duration_minutes: number | null;
  energy_rating: number | null;
  diet_rating: number | null;
  digestion_rating: number | null;
  workout_rating: string | null;
  steps: number | null;
}
