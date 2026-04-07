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
}

export const VISIT_ATTENDANCE_STATUS_OPTIONS: VisitAttendanceStatusOption[] = [
  {
    id: 1,
    nameEn: 'Not Arrived',
    nameAr: 'لم يصل',
    value: VISIT_ATTENDANCE_STATUS_ENUM.NotArrived,
  },
  {
    id: 2,
    nameEn: 'In Visit',
    nameAr: 'في الزيارة',
    value: VISIT_ATTENDANCE_STATUS_ENUM.InVisit,
  },
  {
    id: 3,
    nameEn: 'Finished',
    nameAr: 'انتهت الزيارة',
    value: VISIT_ATTENDANCE_STATUS_ENUM.Finished,
  },
  {
    id: 4,
    nameEn: 'No Show',
    nameAr: 'لم يحضر',
    value: VISIT_ATTENDANCE_STATUS_ENUM.NoShow,
  },
];
