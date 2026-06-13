import { formatToFrenchDayMonth } from '../../../../utils/dateUtils';

export type ChartOptionsFactory = (dates: string[], values: (number | null)[]) => any;

const xAxisParams = (dates: string[]) => {
  const dataLength = dates.length;

  return {
    type: 'category',
    data: dates,
    axisLabel: {
      interval: dataLength > 15 ? 2 : dataLength > 8 ? 1 : 0,
      rotate: 45,
      align: 'right',
      fontSize: 11,
      // Optional: Show only day + month for better readability
      formatter: (value: string) => {
        if (!value) return '';
        const [year, month, day] = value.split('-');
        return `${day}/${month}`;
      },
    },
    axisTick: {
      alignWithLabel: true,
    },
  };
};

const gridParameters = {
  left: 0,
  right: 0,
  bottom: 48,
  top: 16,
};

const formatTooltipValue = (value: number | null, section: string): string => {
  if (value === null) return '—';

  if (section === 'sleep') {
    const h = Math.floor(value);
    const m = Math.round((value - h) * 60);
    return `${h}h${String(m).padStart(2, '0')}`;
  } else if (section === 'weights') {
    return `${value} kg`;
  } else if (section === 'steps') {
    return `${Math.round(value)} pas`;
  } else if (section === 'energy') {
    return `${value} / 5`;
  }
  return value.toString();
};

export const chartOptionsMap: Record<string, ChartOptionsFactory> = {
  sleep: (dates, values) => {
    const validValues = values.filter((v): v is number => v !== null);
    const minV = validValues.length ? Math.min(...validValues) : 0;
    const maxV = validValues.length ? Math.max(...validValues) : 10;

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const date = dates[dataIndex];
          const value = values[dataIndex];

          return `
          <div style="font-size: 13px;">
            <strong>${formatToFrenchDayMonth(date)}</strong><br/>
            Sommeil : <strong>${formatTooltipValue(value, 'sleep')}</strong>
          </div>
        `;
        },
      },
      xAxis: xAxisParams(dates),
      grid: gridParameters,
      yAxis: {
        type: 'value',
        min: Math.floor(minV * 2) / 2 - 0.5,
        max: Math.ceil(maxV * 2) / 2 + 0.5,
        interval: 0.5,
        axisLabel: {
          /* unchanged */
        },
      },
      series: [
        {
          type: 'line',
          data: values,
          smooth: true,
          connectNulls: true // Connect points even if there are nulls (will show gaps for nulls)
        },
      ],
    };
  },

  weights: (dates, values) => {
    const validValues = values.filter((v): v is number => v !== null);
    const minV = validValues.length ? Math.min(...validValues) : 0;
    const maxV = validValues.length ? Math.max(...validValues) : 100;

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const date = dates[dataIndex];
          const value = values[dataIndex];

          return `
          <div style="font-size: 13px;">
            <strong>${date}</strong><br/>
            Poids : <strong>${formatTooltipValue(value, 'weights')}</strong>
          </div>
        `;
        },
      },
      xAxis: xAxisParams(dates),
      grid: gridParameters,
      yAxis: {
        type: 'value',
        min: Math.max(0, minV - 2),
        max: maxV + 2,
      },
      series: [
        {
          type: 'line',
          data: values,
          smooth: true,
          connectNulls: true,
        },
      ],
    };
  },

  steps: (dates, values) => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const date = dates[dataIndex];
        const value = values[dataIndex];

        return `
          <div style="font-size: 13px;">
            <strong>${date}</strong><br/>
            Pas : <strong>${formatTooltipValue(value, 'steps')}</strong>
          </div>
        `;
      },
    },
    xAxis: xAxisParams(dates),
    grid: gridParameters,
    yAxis: {
      type: 'value',
      min: 0,
      max: Math.max(...values.filter((v): v is number => v !== null), 0),
    },
    series: [
      { type: 'bar', data: values.map((v) => v ?? 0) },
    ],
  }),

  energy: (dates, values) => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const date = dates[dataIndex];
        const value = values[dataIndex];

        return `
          <div style="font-size: 13px;">
            <strong>${date}</strong><br/>
            Énergie : <strong>${formatTooltipValue(value, 'energy')}</strong>
          </div>
        `;
      },
    },
    xAxis: xAxisParams(dates),
    grid: gridParameters,
    yAxis: {
      type: 'value',
      min: 0,
      max: 5,
      interval: 1,
    },
    series: [
      {
        type: 'line',
        data: values,
        smooth: true,
        connectNulls: true,
      },
    ],
  }),
};