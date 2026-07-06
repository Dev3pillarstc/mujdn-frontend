import { SystemTypeEnum } from '@/enums/system-type-enum';

export class MenuItem {
  declare label: string;
  declare iconUrl?: string;
  declare routerLink?: string[];
  declare routeId?: string;
  declare system?: SystemTypeEnum;
  declare children?: MenuItem[];
}
