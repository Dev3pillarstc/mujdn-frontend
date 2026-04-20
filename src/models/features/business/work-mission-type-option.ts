import { WorkMissionTypesEnum } from '@/enums/work-mission-type-enum';

export interface WorkMissionTypeOption {
  id: number;
  nameEn: string;
  nameAr: string;
  value: WorkMissionTypesEnum;
}

export const WORK_MISSION_TYPE_OPTIONS: WorkMissionTypeOption[] = [
  {
    id: 1,
    nameEn: 'Full Day',
    nameAr: 'يوم كامل',
    value: WorkMissionTypesEnum.FullDay,
  },
  {
    id: 2,
    nameEn: 'Shift Beginning',
    nameAr: 'بداية الدوام',
    value: WorkMissionTypesEnum.ShiftBeginning,
  },
  {
    id: 3,
    nameEn: 'Shift Ending',
    nameAr: 'نهاية الدوام',
    value: WorkMissionTypesEnum.ShiftEnding,
  },
];

export function getWorkMissionTypeName(
  value: WorkMissionTypesEnum | null | undefined,
  isEnglish: boolean
): string {
  const option = WORK_MISSION_TYPE_OPTIONS.find((item) => item.value === value);
  if (!option) {
    return '';
  }

  return isEnglish ? option.nameEn : option.nameAr;
}
