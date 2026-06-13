export const todayFR = () => {
  const d = new Date();
  return (
    String(d.getDate()).padStart(2, '0') +
    '/' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '/' +
    d.getFullYear()
  );
};

export function formatToFrenchDayMonth(dateInput: string | Date): string {
  if (!dateInput) return '';

  let date: Date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    // Handle both "DD/MM/YYYY" and "YYYY-MM-DD"
    if (dateInput.includes('/')) {
      const [day, month, year] = dateInput.split('/').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      // Assume ISO format YYYY-MM-DD
      date = new Date(dateInput);
    }
  } else {
    return '';
  }

  // Guard against invalid dates
  if (isNaN(date.getTime())) {
    console.warn('Invalid date input:', dateInput);
    return String(dateInput); // fallback
  }

  const formatted = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date);

  // Capitalize first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export const formatDateFR = (raw: any) => {
  if (!raw) return '—';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(String(raw))) {
    return String(raw);
  }
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return String(raw);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch (e) {
    return String(raw);
  }
};

export const yesterdayFR = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1); // hier
  return String(d.getDate()).padStart(2,'0') + '/'
       + String(d.getMonth()+1).padStart(2,'0') + '/'
       + d.getFullYear();
}