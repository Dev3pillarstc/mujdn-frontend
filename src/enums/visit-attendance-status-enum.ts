export enum VISIT_ATTENDANCE_STATUS_ENUM {
  NotArrived = 1, // Approved, visit time not yet passed, no swipe
  InVisit = 2, // Has ArrivalTime, no LeaveTime
  Finished = 3, // Has ArrivalTime and LeaveTime
  NoShow = 4, // Visit time passed, never arrived
}

export interface VisitAttendanceStatusOption {
  id: number;
  nameEn: string;
  nameAr: string;
  value: VISIT_ATTENDANCE_STATUS_ENUM;
  badgeClass: string;
  dotClass: string;
  translationKey: string;
}

export const VISIT_ATTENDANCE_STATUS_OPTIONS: VisitAttendanceStatusOption[] = [
  {
    id: 1,
    nameEn: 'Not Arrived',
    nameAr: 'لم يصل',
    value: VISIT_ATTENDANCE_STATUS_ENUM.NotArrived,
    badgeClass:
      'text-[14px] text-[#f59e0b] px-2 py-1 w-fit inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#fffbeb] font-medium',
    dotClass: 'w-[10px] h-[10px] bg-[#f59e0b] rounded-full',
    translationKey: 'VISIT_ATTENDANCE_STATUS.NOT_ARRIVED',
  },
  {
    id: 2,
    nameEn: 'In Visit',
    nameAr: 'في الزيارة',
    value: VISIT_ATTENDANCE_STATUS_ENUM.InVisit,
    badgeClass:
      'text-[14px] text-[#1849a9] min-w-[101px] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#eff8ff] font-medium',
    dotClass: 'w-[10px] h-[10px] bg-[#1849a9] rounded-full',
    translationKey: 'VISIT_ATTENDANCE_STATUS.IN_VISIT',
  },
  {
    id: 3,
    nameEn: 'Finished',
    nameAr: 'انتهت الزيارة',
    value: VISIT_ATTENDANCE_STATUS_ENUM.Finished,
    badgeClass:
      'text-[14px] text-[#085d3a] min-w-[101px] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#ecfdf3] font-medium',
    dotClass: 'w-[10px] h-[10px] bg-[#085d3a] rounded-full',
    translationKey: 'VISIT_ATTENDANCE_STATUS.FINISHED',
  },
  {
    id: 4,
    nameEn: 'No Show',
    nameAr: 'لم يحضر',
    value: VISIT_ATTENDANCE_STATUS_ENUM.NoShow,
    badgeClass:
      'text-[14px] text-[#912018] min-w-[101px] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#fef3f2] font-medium',
    dotClass: 'w-[10px] h-[10px] bg-[#912018] rounded-full',
    translationKey: 'VISIT_ATTENDANCE_STATUS.NO_SHOW',
  },
];
