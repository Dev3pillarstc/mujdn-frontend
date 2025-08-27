import { WeekDaysEnum } from '@/enums/week-days-enum';
import { FormArray, FormGroup } from '@angular/forms';

// used in base-crud service for date filtering
export const genericDateOnlyConvertor = function (model: any) {
  if (!model) return model;

  Object.keys(model).forEach((key) => {
    const value = model[key];

    // Only transform if it's specifically a Date
    if (value instanceof Date) {
      const year = model[key].getFullYear();
      const month = `${model[key].getMonth() + 1}`.padStart(2, '0');
      const day = `${model[key].getDate()}`.padStart(2, '0');
      model[key] = `${year}-${month}-${day}`;
    }
  });

  return model;
};

// used for sending data to backend (interceptor)
export const toDateOnly = function (date: any) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toDateTime = function (date: any) {
  if (date == null) return null;
  date = date.toString();
  date = new Date(date);
  return date;
};

// used to convert time string to date object (Receiving from backend)
export function timeStringToDate(value: string): Date {
  const [hours, minutes, seconds] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds || 0, 0);
  return date;
}

// used to convert date object to time string (Sending to backend)
export function dateToTimeString(date: Date): string | null {
  if (!date) return null;
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}:00`;
}

// create a function that takes a UTC date and returns the date in local time
export const toLocalTime = function (date: any) {
  date = new Date(date);
  return date.toLocaleString();
};

// used to convert UTC time to KSA time (Interceptor function)
export function convertUtcToSystemTimeZone(utcDateTime: Date | string): Date {
  // Now is KSA time
  // based on time zone change the offset
  const utcDate = new Date(utcDateTime);

  // add 3 hours to convert to KSA time
  const ksaTime = new Date(utcDate.getTime() + 3 * 60 * 60 * 1000);

  return ksaTime;
}
export function convertUtcTimeToSystemTimeZone(
  utcTimeString: string,
  anchorDate?: Date | string
): string {
  if (!utcTimeString) return '';

  // ---- parse "time of day" (supports 24h or 12h with AM/PM) ----
  const trimmed = utcTimeString.trim();
  const ampmMatch = trimmed.match(/^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])\s*$/);
  const hhmmssMatch = trimmed.match(/^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*$/);

  let h = 0, m = 0, s = 0;
  if (ampmMatch) {
    h = Number(ampmMatch[1]);
    m = Number(ampmMatch[2]);
    s = ampmMatch[3] ? Number(ampmMatch[3]) : 0;
    const isPM = /pm/i.test(ampmMatch[4]);
    if (h === 12) h = 0;         // 12AM -> 0, 12PM handled below
    if (isPM) h += 12;           // PM -> add 12
  } else if (hhmmssMatch) {
    h = Number(hhmmssMatch[1]);
    m = Number(hhmmssMatch[2]);
    s = hhmmssMatch[3] ? Number(hhmmssMatch[3]) : 0;
  } else {
    return ''; // unrecognized format
  }

  // ---- choose anchor date (today by default) ----
  const anchor = anchorDate ? new Date(anchorDate) : new Date();

  // Build a UTC timestamp for that anchor calendar date + time-of-day in UTC
  const utcMillis = Date.UTC(
    anchor.getUTCFullYear(),
    anchor.getUTCMonth(),
    anchor.getUTCDate(),
    h, m, s, 0
  );

  // Interpret that instant in local time (no manual offset math; Date does it)
  const local = new Date(utcMillis);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(local.getHours())}:${pad(local.getMinutes())}:${pad(local.getSeconds())}`;
}
// --Formating date for view only--
// Format time string (HH:MM:SS) to 12-hour format (No time zone conversion)
export function formatTimeTo12Hour(
  timeString: string,
  locale: 'en-US' | 'ar-EG' = 'en-US'
): string {
  if (!timeString) return '';

  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  // Always use 'en-US' to ensure numbers are Latin digits
  const formatted = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (locale === 'ar-EG') {
    return formatted.replace('AM', 'ص').replace('PM', 'م');
  }

  return formatted;
}

// Format Date object to 12-hour format (No time zone conversion)
export function formatDateTo12Hour(date: Date, locale: 'en-US' | 'ar-EG' = 'en-US'): string {
  if (!date) return '';

  // Always use 'en-US' to ensure numbers are Latin digits
  const formatted = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (locale === 'ar-EG') {
    return formatted.replace('AM', 'ص').replace('PM', 'م');
  }

  return formatted;
}

export function formatSwipeTime(
  swipeTime: string | undefined,
  locale: 'en-US' | 'ar-EG' = 'en-US'
): { date: string; time: string } {
  if (!swipeTime) return { date: '', time: '' };

  const dateTime = new Date(swipeTime);
  const date = dateTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const time = dateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (locale === 'ar-EG') {
    return {
      date: date.replace('AM', 'ص').replace('PM', 'م'),
      time: time.replace('AM', 'ص').replace('PM', 'م'),
    };
  }

  return { date, time };
}

export function markFormGroupTouched(form: FormGroup | FormArray) {
  Object.values(form.controls).forEach((control) => {
    if (control instanceof FormGroup || control instanceof FormArray) {
      markFormGroupTouched(control); // Recursive call
    } else {
      control.markAsTouched();
    }
  });
}

// Helper function to build translation parameters dynamically
export function buildTranslationParams(details: any, translateService: any): any {
  const translationParams: any = {};
  const currentLang = translateService.currentLang || 'en';

  Object.keys(details).forEach((key) => {
    // Extract the first value from the array, as Details is IDictionary<string, string[]>
    const value =
      Array.isArray(details[key]) && details[key].length > 0 ? details[key][0] : details[key];
    if (key.endsWith('En') && currentLang === 'en') {
      const baseKey = key.replace('En', '');
      translationParams[baseKey] = value;
    } else if (key.endsWith('Ar') && currentLang === 'ar') {
      const baseKey = key.replace('Ar', '');
      translationParams[baseKey] = value;
    } else if (!key.endsWith('En') && !key.endsWith('Ar')) {
      // For non-language-specific parameters
      translationParams[key] = value;
    }
  });

  console.log('Translation params:', translationParams); // Debug log
  return translationParams;
}

export const weekDays = [
  { labelKey: 'USER_WORK_SHIFT_ASSIGNMENT.SATURDAY', value: WeekDaysEnum.SATURDAY },
  { labelKey: 'USER_WORK_SHIFT_ASSIGNMENT.SUNDAY', value: WeekDaysEnum.SUNDAY },
  { labelKey: 'USER_WORK_SHIFT_ASSIGNMENT.MONDAY', value: WeekDaysEnum.MONDAY },
  { labelKey: 'USER_WORK_SHIFT_ASSIGNMENT.TUESDAY', value: WeekDaysEnum.TUESDAY },
  { labelKey: 'USER_WORK_SHIFT_ASSIGNMENT.WEDNESDAY', value: WeekDaysEnum.WEDNESDAY },
  { labelKey: 'USER_WORK_SHIFT_ASSIGNMENT.THURSDAY', value: WeekDaysEnum.THURSDAY },
  { labelKey: 'USER_WORK_SHIFT_ASSIGNMENT.FRIDAY', value: WeekDaysEnum.FRIDAY },
];
