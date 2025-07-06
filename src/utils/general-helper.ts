import { FormArray, FormGroup } from '@angular/forms';

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

export const toDateOnly = function (date: any) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toDateTime = function (date: any) {
  date = date?.toString() ?? '';
  date = new Date(date);
  return date;
};

export function timeStringToDate(value: string): Date {
  const [hours, minutes, seconds] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds || 0, 0);
  return date;
}

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

export function markFormGroupTouched(form: FormGroup | FormArray) {
  Object.values(form.controls).forEach((control) => {
    if (control instanceof FormGroup || control instanceof FormArray) {
      markFormGroupTouched(control); // Recursive call
    } else {
      control.markAsTouched();
    }
  });
}
