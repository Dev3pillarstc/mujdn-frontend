import { WorkMissionTypesEnum } from '@/enums/work-mission-type-enum';

export default class MyWorkMissionFilter {
  declare nameEn?: string;
  declare nameAr?: string;
  declare startDate?: Date;
  declare endDate?: Date;
  declare missionCreatorId?: number;
  declare workMissionType?: WorkMissionTypesEnum;
}
