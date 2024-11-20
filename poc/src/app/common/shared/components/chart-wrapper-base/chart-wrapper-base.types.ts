export enum CHART_TYPE {
  LINE = 'LINE',
  BAR = 'BAR',
}

export enum CHART_EVENT_TYPE {
  CLICK = 'CLICK',
  ZOOM = 'ZOOM',
  AFTER_INIT = 'AFTER_INIT',
}

export type ChartEvent = { type: CHART_EVENT_TYPE; data?: any }
