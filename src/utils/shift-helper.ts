import { WorkShiftType } from '@/enums/work-shift-type';

/**
 * Determines if a given date is a working day based on the WorkShiftType.
 * Supports:
 * 1. Standard (1): Checks against employee specific working days or organization default settings.
 * 2. WeekOnWeekOff (2) & WeekOnWeekOff24 (3): Follows a 14-day cycle (7 days work / 7 days off).
 *
 * @param workShiftType The type of work shift
 * @param startDate The start date of the shift cycle (required for cycle-based shifts)
 * @param checkDate The date to check (defaults to today)
 * @param employeeWorkingDays Comma-separated list of working day indices (0=Sun, 1=Mon, etc.)
 * @param workDaysSetting Default working days settings (fallback for Standard shifts)
 * @returns true if it is a working day, false otherwise
 */
export function isShiftWorkingDay(
  workShiftType: number,
  startDate: Date | string,
  checkDate: Date | string = new Date(),
  employeeWorkingDays?: string,
  workDaysSetting?: { [key: string]: any }
): boolean {
  const check = new Date(checkDate);
  check.setHours(0, 0, 0, 0);

  if (isNaN(check.getTime())) {
    console.warn('Invalid checkDate provided to isShiftWorkingDay');
    return false;
  }

  // Handle Standard Shift (Fixed Days)
  if (workShiftType === WorkShiftType.Standard) {
    const dayOfWeek = check.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Option A: Specific working days assigned to the employee (e.g., "0,1,2,3,4")
    if (employeeWorkingDays) {
      const workingDayValues = employeeWorkingDays
        .split(',')
        .map((day) => parseInt(day.trim(), 10))
        .filter((day) => !isNaN(day));
      return workingDayValues.includes(dayOfWeek);
    }

    // Option B: Fallback to organization default settings (object with sunday: true, etc.)
    if (workDaysSetting) {
      const dayNames = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const dayName = dayNames[dayOfWeek];
      // Explicitly check for true to handle both boolean and potential null/undefined
      return workDaysSetting[dayName] === true;
    }

    // Default for Standard: If no settings, assume standard work week (Sun-Thu) or just return true
    return true;
  }

  // Handle Cycle-based Shifts (7-on / 7-off)
  if (
    workShiftType === WorkShiftType.WeekOnWeekOff ||
    workShiftType === WorkShiftType.WeekOnWeekOff24
  ) {
    if (!startDate) return false;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime())) {
      console.warn('Invalid startDate provided to isShiftWorkingDay');
      return false;
    }

    const diffTime = check.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const cycleLength = 14;
    // Normalize cycle index to be positive 0-13
    const cycleIndex = ((diffDays % cycleLength) + cycleLength) % cycleLength;

    // Days 0-6 are Work (7 days), Days 7-13 are Off (7 days)
    return cycleIndex < 7;
  }

  return false;
}
