import { VisitStatusEnum } from '@/enums/visit-status-enum';

// Visit Status Options for Dropdown
export interface VisitStatusOption {
  id: number;
  nameEn: string;
  nameAr: string;
  value: VisitStatusEnum;
}

export const VISIT_STATUS_OPTIONS: VisitStatusOption[] = [
  {
    id: 1,
    nameEn: 'New',
    nameAr: 'جديد',
    value: VisitStatusEnum.NEW,
  },
  {
    id: 2,
    nameEn: 'Approved',
    nameAr: 'مقبول',
    value: VisitStatusEnum.APPROVED,
  },
  {
    id: 3,
    nameEn: 'Rejected',
    nameAr: 'مرفوض',
    value: VisitStatusEnum.REJECTED,
  },
];
