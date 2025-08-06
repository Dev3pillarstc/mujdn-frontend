import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { WeekDaysEnum } from '@/enums/week-days-enum';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import EmployeeShifts from '@/models/features/lookups/work-shifts/employee-shifts';
import { weekDays } from '@/utils/general-helper';

@Component({
  selector: 'app-work-days-popup',
  imports: [TranslatePipe],
  templateUrl: './work-days-popup.component.html',
})
export class WorkDaysPopupComponent extends BasePopupComponent<EmployeeShifts> implements OnInit {
  model!: EmployeeShifts;
  form!: FormGroup;
  translateService = inject(TranslateService);

  displayDays: { labelKey: string; value: WeekDaysEnum; isSelected: boolean }[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { model: EmployeeShifts }
  ) {
    super();
    this.model = data.model;
  }

  initPopup(): void {
    this.prepareDisplayDays();
  }

  buildForm(): void {}

  beforeSave(model: EmployeeShifts, form: FormGroup): boolean {
    return true;
  }

  prepareModel(model: EmployeeShifts, form: FormGroup): EmployeeShifts {
    return model;
  }

  saveFail(error: Error): void {}

  afterSave(model: EmployeeShifts, dialogRef: any): void {}

  private prepareDisplayDays(): void {
    const workingDayValues = this.model.employeeWorkingDays
      ? this.model.employeeWorkingDays.split(',').map((day) => parseInt(day.trim(), 10))
      : [];

    this.displayDays = weekDays
      .filter((day) => workingDayValues.includes(day.value))
      .map((day) => ({
        ...day,
        isSelected: true,
      }));
  }

  getDayLabel(labelKey: string): string {
    return this.translateService.instant(labelKey);
  }
}
