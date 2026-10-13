import { CheckinData, Question } from "../../../../models/checkin_models";

function extractTime(fullDatetime: string | null): string {
  if (!fullDatetime) return '';

  const match = fullDatetime.match(/(\d{2}:\d{2})/);
  return match ? match[1] : '';
}

export function normalizeForEditing(data: CheckinData): CheckinData {
  const normalized = { ...data };

  // Time fields - extract HH:mm
  if (normalized.sleep_start_time) {
    normalized.sleep_start_time = extractTime(normalized.sleep_start_time);
  }
  if (normalized.sleep_end_time) {
    normalized.sleep_end_time = extractTime(normalized.sleep_end_time);
  }

  if (normalized.workout_rating) {
    normalized.workout_rating = (() => {
      switch (normalized.workout_rating) {
        case 'poor': return 'BOF';
        case 'okay': return 'MOYEN';
        case 'good': return 'BIEN';
        case 'excellent': return 'SUPER';
        case 'rest_day': return 'REPOS';
        default: return normalized.workout_rating;
      }
    })();
  }

  // Ensure ratings are strings for <select> compatibility
  const ratingFields: (keyof CheckinData)[] = [
    'sleep_rating', 'energy_rating', 'diet_rating', 
    'digestion_rating'
  ];
  ratingFields.forEach(field => {
    if (normalized[field] != null) {
      normalized[field] = String(normalized[field]) as any;
    }
  });

  return normalized;
}

export const questionsList: Question[] = [
  {
    name: 'weight',
    label: 'Poids (kg) ?',
    type: 'number',
    step: '0.1',
    validate: (v: string) => v !== '' && !isNaN(Number(v)) && Number(v) > 0,
  },
  {
    name: 'sleep_rating',
    label: 'Sommeil (note sur 5)',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
    validate: (v: string) => ['1', '2', '3', '4', '5'].includes(v),
  },
  {
    name: 'sleep_start_time',
    label: 'Heure du coucher ?',
    type: 'time',
    step: '60',
    validate: (v: string) => isHHMM(v),
  },
  {
    name: 'sleep_end_time',
    label: 'Heure du lever ?',
    type: 'time',
    step: '60',
    validate: (v: string) => isHHMM(v),
  },
  {
    name: 'energy_rating',
    label: 'Énergie (note sur 5)',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
    validate: (v: string) => ['1', '2', '3', '4', '5'].includes(v),
  },
  {
    name: 'diet_rating',
    label: 'Adhésion à la diète (note sur 5)',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
    validate: (v: string) => ['1', '2', '3', '4', '5'].includes(v),
  },
  {
    name: 'digestion_rating',
    label: 'Digestion (note sur 5)',
    type: 'select',
    options: ['1', '2', '3', '4', '5'],
    validate: (v: string) => ['1', '2', '3', '4', '5'].includes(v),
  },
  {
    name: 'workout_rating',
    label: 'Séance',
    type: 'select',
    options: ['BOF', 'MOYEN', 'BIEN', 'SUPER', 'REPOS'],
    validate: (v: string) => ['BOF', 'MOYEN', 'BIEN', 'SUPER', 'REPOS'].includes(v),
  },
  {
    name: 'steps',
    label: 'Nombre de pas (steps)',
    type: 'number',
    step: '1',
    min: '0',
    validate: (v: string) => String(v) !== '',
  },
];

export const bulkInitialState: CheckinData = {
  id: null,
  user_id: null,
  checkin_date: null,
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
};

const isHHMM = (v: string) => {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(v || '').trim());
};
