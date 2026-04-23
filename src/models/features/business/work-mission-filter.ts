import { WorkMissionTypesEnum } from '@/enums/work-mission-type-enum';

export default class WorkMissionFilter {
  declare nameEn?: string;
  declare nameAr?: string;
  declare startDate?: Date;
  declare endDate?: Date;
  declare workMissionType?: WorkMissionTypesEnum;
}
