export type ChartOptionsFactory = (
  dates: string[],
  values: number[]
) => any;

const xAxisParams = (dates: any) => {
  return {
    type: 'category',
    data: dates,
    axisLabel: { interval: 0, rotate: 45, align: 'right' },
  };
}

const gridParameters = {
  left: 0,
  right: 0,
  bottom: 48,
  top: 16,
};

export const chartOptionsMap: Record<string, ChartOptionsFactory> = {
  sleep: (dates, values) => ({
    tooltip: { trigger: 'axis' },
    xAxis: xAxisParams(dates),
    grid: gridParameters,
    yAxis: (() => {
      const minV = Math.min(...values);
      const maxV = Math.max(...values);
      const yMin = Math.floor(minV * 2) / 2;
      const yMax = Math.ceil(maxV * 2) / 2;
      const finalMin = isFinite(yMin) ? yMin : 0;
      const finalMax = isFinite(yMax) ? (yMax === finalMin ? finalMin + 1 : yMax) : 10;

      return {
        type: 'value',
        min: finalMin,
        max: finalMax,
        interval: 0.5,
        axisLabel: {
          formatter: (value: number) => {
            const h = Math.floor(value);
            const m = Math.round((value - h) * 60);
            const mm = String(m).padStart(2, '0');
            return `${h}h${mm}`;
          }
        }
      };
    })(),
    series: [
      { type: 'line', data: values, smooth: true },
    ],
  }),

  weights: (dates, values) => ({
    tooltip: { trigger: 'axis' },
    xAxis: xAxisParams(dates),
    grid: gridParameters,
    yAxis: {
      type: 'value',
      min: Math.min(...values) - 10,
      max: Math.max(...values) + 10,
    },
    series: [
      { type: 'line', data: values, smooth: true },
    ],
  }),

  steps: (dates, values) => ({
    tooltip: { trigger: 'axis' },
    xAxis: xAxisParams(dates),
    grid: gridParameters,
    yAxis: {
      type: 'value',
      min: 0,
      max: Math.max(...values),
    },
    series: [
      { type: 'bar', data: values },
    ],
  }),

  energy: (dates, values) => ({
    tooltip: { trigger: 'axis' },
    xAxis: xAxisParams(dates),
    grid: gridParameters,
    yAxis: {
      type: 'value',
      min: 0,
      max: 5,
      interval: 1,
    },
    series: [
      { type: 'line', data: values, smooth: true },
    ],
  }),
};