// device-status.enum.ts
export enum DEVICE_STATUS_ENUM {
  NOT_CONNECTED = 0,
  CONNECTED = 1,
  NOT_ASSIGNED = 2,
}

export const DEVICE_STATUS_TRANSLATIONS: Record<DEVICE_STATUS_ENUM, string> = {
  [DEVICE_STATUS_ENUM.NOT_CONNECTED]: 'DEVICE_STATUS.NOT_CONNECTED',
  [DEVICE_STATUS_ENUM.CONNECTED]: 'DEVICE_STATUS.CONNECTED',
  [DEVICE_STATUS_ENUM.NOT_ASSIGNED]: 'DEVICE_STATUS.NOT_ASSIGNED',
};

export interface DeviceStatusOption {
  value: DEVICE_STATUS_ENUM;
  labelKey: string;
}

export const DEVICE_STATUS_OPTIONS: DeviceStatusOption[] = Object.values(DEVICE_STATUS_ENUM)
  .filter((v) => typeof v === 'number') // Ensure only numeric values are included
  .map((v) => ({
    value: v as DEVICE_STATUS_ENUM,
    labelKey: DEVICE_STATUS_TRANSLATIONS[v as DEVICE_STATUS_ENUM],
  }));

export const DEVICE_STATUS_CONFIG: Record<
  DEVICE_STATUS_ENUM,
  {
    labelKey: string;
    bgColor: string;
    textColor: string;
    dotColor: string;
  }
> = {
  [DEVICE_STATUS_ENUM.NOT_CONNECTED]: {
    labelKey: 'DEVICE_STATUS.NOT_CONNECTED',
    bgColor: '#fef2f2',
    textColor: '#b91c1c',
    dotColor: '#b91c1c',
  },
  [DEVICE_STATUS_ENUM.CONNECTED]: {
    labelKey: 'DEVICE_STATUS.CONNECTED',
    bgColor: '#ecfdf3',
    textColor: '#085d3a',
    dotColor: '#085d3a',
  },
  [DEVICE_STATUS_ENUM.NOT_ASSIGNED]: {
    labelKey: 'DEVICE_STATUS.NOT_ASSIGNED',
    bgColor: '#fefce8',
    textColor: '#92400e',
    dotColor: '#92400e',
  },
};
