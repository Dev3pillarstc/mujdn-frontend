import { WorkShiftType } from '@/enums/work-shift-type';

/**
 * Determines if a given date is a working day based on the WorkShiftType.
 * Supports WeekOnWeekOff (2) and WeekOnWeekOff24 (3) which follow a 7 days work / 7 days off pattern.
 *
 * @param workShiftType The type of work shift (e.g., WorkShiftTypeEnum.WeekOnWeekOff)
 * @param startDate The start date of the shift cycle
 * @param checkDate The date to check (defaults to today)
 * @returns true if it is a working day, false otherwise (or if shift type is not supported)
 */
export function isShiftWorkingDay(
  workShiftType: number,
  startDate: Date | string,
  checkDate: Date | string = new Date()
): boolean {
  if (!startDate) {
    return false;
  }

  // Normalize dates to Date objects
  const start = new Date(startDate);
  const check = new Date(checkDate);

  // Set time to midnight for accurate day difference calculation regardless of time
  start.setHours(0, 0, 0, 0);
  check.setHours(0, 0, 0, 0);

  // Validate dates
  if (isNaN(start.getTime()) || isNaN(check.getTime())) {
    console.warn('Invalid date(s) provided to isShiftWorkingDay');
    return false;
  }

  // Calculate difference in milliseconds
  const diffTime = check.getTime() - start.getTime();

  // Calculate difference in days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Logic for 7 days work, 7 days off (14 day cycle)
  if (
    workShiftType === WorkShiftType.WeekOnWeekOff ||
    workShiftType === WorkShiftType.WeekOnWeekOff24
  ) {
    const cycleLength = 14;
    // Normalize index to be positive (0 to 13)
    // This handles cases where checkDate is before startDate correctly if the pattern extends backwards
    const cycleIndex = ((diffDays % cycleLength) + cycleLength) % cycleLength;

    // Days 0-6 are Work (7 days)
    // Days 7-13 are Off (7 days)
    return cycleIndex < 7;
  }

  return false;
}
