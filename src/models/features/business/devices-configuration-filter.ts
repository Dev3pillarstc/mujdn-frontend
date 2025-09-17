import { DEVICE_STATUS_ENUM } from '@/enums/device-status-enum';

export default class DevicesConfigurationFilter {
  declare deviceCode?: string;
  declare deviceIp?: string;
  declare deviceName?: string;
  declare accessLocationId?: number;
  declare status?: DEVICE_STATUS_ENUM;
}
