import { ChangeDetectorRef, Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';

import { distinctUntilChanged, Observable } from 'rxjs';
import { AlertService } from '@/services/shared/alert.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import Shift from '@/models/features/lookups/work-shifts/shift';
import { WeekDaysEnum } from '@/enums/week-days-enum';
import { weekDays } from '@/utils/general-helper';
import { WorkDaysSetting } from '@/models/features/setting/work-days-setting';
import { UserWorkShiftService } from '@/services/features/lookups/user-workshift.service';
import { PaginationParams } from '@/models/shared/pagination-params';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { InputNumberModule } from 'primeng/inputnumber';
import { RotationGroup } from '@/models/features/lookups/work-shifts/rotation-group';
import UserWorkShift from '@/models/features/lookups/work-shifts/user-work-shifts';
import { WorkShiftType } from '@/enums/work-shift-type';
import { ShiftAssignmentPanelComponent } from './shift-assignment-panel/shift-assignment-panel.component';

@Component({
  selector: 'app-work-shifts-assignment-popup',
  imports: [
    CommonModule,
    Select,
    DatePickerModule,
    ReactiveFormsModule,
    TranslatePipe,
    ValidationMessagesComponent,
    InputNumberModule,
    ShiftAssignmentPanelComponent,
  ],
  templateUrl: './work-shifts-assignment-popup.component.html',
  styleUrl: './work-shifts-assignment-popup.component.scss',
})
export class WorkShiftsAssignmentPopupComponent
  extends BasePopupComponent<UserWorkShift>
  implements OnInit {
  model!: UserWorkShift;
  usersProfiles: UsersWithDepartmentLookup[] = [];
  workDays: WorkDaysSetting = new WorkDaysSetting();
  departments: BaseLookupModel[] = [];
  shifts: Shift[] = [];
  workShiftType = WorkShiftType;
  form!: FormGroup;
  viewMode!: ViewModeEnum;
  fb = inject(FormBuilder);
  alertService = inject(AlertService);
  langService = inject(LanguageService);
  isCreateMode = false;
  selectedWorkingDays: number[] = [];
  userWorkShiftService = inject(UserWorkShiftService);
  minEndDate: Date | null = null;
  maxStartDate: Date | null = null;
  previousStandardWorkingDays: number[] = [];
  allowedWeekDaysInRange: number[] = [];
  activeShift: number = 0;

  // Single shift: tracks selected member IDs for the standard shift panel
  singleShiftMemberIds: number[] = [];

  // Rotating shifts: one RotationGroup per tab (periodOrder 0, 1, 2)
  rotationGroups: RotationGroup[] = [0, 1, 2].map(periodOrder =>
    Object.assign(new RotationGroup(), { periodOrder, memberIds: [] })
  );

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override initPopup(): void {
    this.model = this.data.model || new UserWorkShift();
    this.usersProfiles = this.data.lookups?.usersProfiles || [];
    this.departments = this.data.lookups?.departments || [];
    this.shifts = this.data.lookups?.shifts || [];
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode === ViewModeEnum.CREATE;

    this.usersProfiles = this.sortByName(this.usersProfiles, this.optionLabel);
    this.departments = this.sortByName(this.departments, this.optionLabel);
    this.shifts = this.sortByName(this.shifts, this.optionLabel);

    this.singleShiftMemberIds = this.model.assignedUserIds || [];
    this.assignSelectedGroupsAndShiftsAndUsers();
    this.initializeSelectedWorkingDays();
  }

  assignSelectedGroupsAndShiftsAndUsers(): void {
    // Restore rotation groups from model in edit mode
    const savedGroups: RotationGroup[] = (this.model as any).rotationGroups || [];
    this.rotationGroups = [0, 1, 2].map(periodOrder => {
      const saved = savedGroups.find(g => g.periodOrder === periodOrder);
      return Object.assign(new RotationGroup(), {
        periodOrder,
        memberIds: saved?.memberIds || [],
        fkShiftId: saved?.fkShiftId,
      });
    });
  }

  private initializeSelectedWorkingDays(): void {
    this.selectedWorkingDays = [];

    if (this.model.employeeWorkingDays) {
      this.selectedWorkingDays = this.model.employeeWorkingDays
        .split(',')
        .map((day) => parseInt(day.trim(), 10))
        .filter((day) => !isNaN(day));
    } else if (this.workDays) {
      const mapping: { [key: string]: WeekDaysEnum } = {
        saturday: WeekDaysEnum.SATURDAY,
        sunday: WeekDaysEnum.SUNDAY,
        monday: WeekDaysEnum.MONDAY,
        tuesday: WeekDaysEnum.TUESDAY,
        wednesday: WeekDaysEnum.WEDNESDAY,
        thursday: WeekDaysEnum.THURSDAY,
        friday: WeekDaysEnum.FRIDAY,
      };

      this.selectedWorkingDays = Object.entries(mapping)
        .filter(([key]) => (this.workDays as any)[key])
        .map(([, value]) => value);
    }

    this.selectedWorkingDays.sort((a, b) => a - b);
    this.previousStandardWorkingDays = [...this.selectedWorkingDays];
  }

  override buildForm(): void {
    this.form = this.fb.group({
      ...this.model.buildForm(),
      fkShiftId: [this.model.fkShiftId ?? null, []],  // not required in this popup
      employeeWorkingDays: [this.selectedWorkingDays.join(','), [this.validateWorkingDays()]],
      userIdsArray: [this.singleShiftMemberIds, [Validators.required]],
      assignmentId: [this.model.id],
      shift1: [this.rotationGroups[0].fkShiftId ?? null],
      shift2: [this.rotationGroups[1].fkShiftId ?? null],
      shift3: [this.rotationGroups[2].fkShiftId ?? null],
    });

    // Link shift dropdowns to rotationGroups fkShiftId
    ['shift1', 'shift2', 'shift3'].forEach((controlName, periodOrder) => {
      this.form.get(controlName)?.valueChanges.subscribe(shiftId => {
        this.rotationGroups[periodOrder].fkShiftId = shiftId;
      });
    });

    this.form.get('workShiftType')?.valueChanges.pipe(distinctUntilChanged()).subscribe((type) => {
      this.onWorkShiftTypeChange(type);
    });

    // Must run before setDropdownValues so dates are not yet in the form.
    // If dates are present, validateAndUpdateWorkingDays filters the saved
    // working days against the date range, which clears them in edit mode.
    this.onWorkShiftTypeChange(this.form.get('workShiftType')?.value);

    this.setDropdownValues();
    this.updateDateConstraints();
    this.refreshAllowedWeekDays(
      (this.form.get('startDate')?.value as Date | null) ?? null,
      (this.form.get('endDate')?.value as Date | null) ?? null
    );
  }

  private setDropdownValues(): void {
    if (!this.isCreateMode) {
      const shiftId = this.model.fkShiftId ?? (this.model as any).shiftDetails?.id;
      if (shiftId) {
        this.form.get('fkShiftId')?.setValue(shiftId);
      }
      if (this.model.workShiftType) {
        this.form.get('workShiftType')?.setValue(this.model.workShiftType);
      } else {
        this.form.get('workShiftType')?.setValue(WorkShiftType.Standard);
      }
      if (this.model.presenceInquiryTime) {
        this.form
          .get('presenceInquiryTime')
          ?.setValue(new Date('1970-01-01T' + this.model.presenceInquiryTime));
      }
      if (this.model.startDate) {
        const startDate =
          typeof this.model.startDate === 'string'
            ? new Date(this.model.startDate)
            : this.model.startDate;
        this.form.get('startDate')?.setValue(startDate);
      }
      if (this.model.endDate) {
        const endDate =
          typeof this.model.endDate === 'string'
            ? new Date(this.model.endDate)
            : this.model.endDate;
        this.form.get('endDate')?.setValue(endDate);
      }

      this.refreshAllowedWeekDays(
        (this.form.get('startDate')?.value as Date | null) ?? null,
        (this.form.get('endDate')?.value as Date | null) ?? null
      );
    }
  }

  // Called by single shift panel when selection changes
  onSingleShiftMembersChange(memberIds: number[]): void {
    this.singleShiftMemberIds = memberIds;
    this.form.get('userIdsArray')?.setValue(memberIds);
    this.form.get('userIdsArray')?.markAsTouched();
  }

  // Called by each rotating shift panel when selection changes
  onRotationGroupMembersChange(periodOrder: number, memberIds: number[]): void {
    this.rotationGroups[periodOrder].memberIds = memberIds;
  }

  getRotationGroup(periodOrder: number): RotationGroup {
    return this.rotationGroups[periodOrder];
  }

  getRotationShift(periodOrder: number): Shift | undefined {
    const controlName = ['shift1', 'shift2', 'shift3'][periodOrder];
    const shiftId = this.form?.get(controlName)?.value;
    return this.shifts.find(s => s.id === shiftId);
  }

  onWorkingDayChange(dayValue: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      if (!this.selectedWorkingDays.includes(dayValue)) {
        this.selectedWorkingDays.push(dayValue);
      }
    } else {
      this.selectedWorkingDays = this.selectedWorkingDays.filter((day) => day !== dayValue);
    }

    this.selectedWorkingDays.sort();
    this.updateEmployeeWorkingDaysInForm();
    this.form.get('employeeWorkingDays')?.markAsTouched();
    this.previousStandardWorkingDays = [...this.selectedWorkingDays];
  }

  private validateWorkingDays(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const selectedDays = value.split(',').filter((day: string) => day.trim() !== '');
      return selectedDays.length === 0 ? { required: true } : null;
    };
  }

  private updateEmployeeWorkingDaysInForm(): void {
    const workingDaysString = this.selectedWorkingDays.join(',');
    this.form.get('employeeWorkingDays')?.setValue(workingDaysString);
    this.form.get('employeeWorkingDays')?.updateValueAndValidity();
  }

  onSaveClick(): void {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });

    if (this.form.valid) {
      const formValue = this.form.value;

      if (this.model.id) {
        this.prepareModel(this.model, this.form);
        this.userWorkShiftService.update(this.model).subscribe({
          next: () => this.dialogRef.close(DIALOG_ENUM.OK),
          error: (err) => this.save$.error(err),
        });
      } else {
        const newModel = new UserWorkShift();
        this.prepareModel(newModel, this.form);

        if (!this.isRotatingType) {
          const userIds = formValue.userIdsArray || [];
          if (userIds.length === 0) return;
          newModel.assignedUserIds = userIds;
        }

        this.userWorkShiftService.assignUserShift(newModel).subscribe({
          next: () => this.dialogRef.close(DIALOG_ENUM.OK),
          error: (err) => this.save$.error(err),
        });
      }
    }
  }

  isWorkingDaySelected(dayValue: number): boolean {
    return this.selectedWorkingDays.includes(dayValue);
  }

  isWeekDayDisabled(dayValue: number): boolean {
    const currentType = this.form.get('workShiftType')?.value;
    if (
      currentType === WorkShiftType.WeekOnWeekOff ||
      currentType === WorkShiftType.WeekOnWeekOff24
    ) {
      return true;
    }

    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;

    if (!startDate || !endDate) return false;

    return !this.getAllowedWeekDaysInRange(startDate, endDate).includes(dayValue);
  }

  private getAllowedWeekDaysInRange(startDate: Date, endDate: Date): number[] {
    const allowedDays = new Set<number>();
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    currentDate.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    while (currentDate <= end) {
      allowedDays.add(currentDate.getDay());
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return Array.from(allowedDays);
  }

  override saveFail(error: Error): void { }

  override afterSave(model: UserWorkShift, dialogRef: MatDialogRef<any, any>): void {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  override beforeSave(model: UserWorkShift, form: FormGroup): Observable<boolean> | boolean {
    return form.valid;
  }

  override prepareModel(
    model: UserWorkShift,
    form: FormGroup
  ): UserWorkShift | Observable<UserWorkShift> {
    const formValue = form.value;

    model.startDate = formValue.startDate;
    model.endDate = formValue.endDate;
    model.employeeWorkingDays = formValue.employeeWorkingDays;
    model.workShiftType = formValue.workShiftType;

    if (formValue.presenceInquiryTime instanceof Date) {
      const time = formValue.presenceInquiryTime;
      model.presenceInquiryTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:00`;
    } else {
      model.presenceInquiryTime = formValue.presenceInquiryTime;
    }
    model.presenceInquiryBuffer = formValue.presenceInquiryBuffer;

    const userIds = formValue.userIdsArray || [];
    model.fkAssignedUserId = userIds.length > 0 ? userIds[0] : null;
    model.assignedUserIds = userIds;
    model.fkShiftId = formValue.fkShiftId;

    (model as any).rotationGroups = this.rotationGroups.map(g => ({
      memberIds: g.memberIds,
      periodOrder: g.periodOrder,
      fkShiftId: g.fkShiftId,
    }));

    return model;
  }

  private sortByName<T extends { [key: string]: any }>(arr: T[], key: string): T[] {
    return [...arr].sort((a, b) => {
      const nameA = (a[key] || '').toString().toLowerCase();
      const nameB = (b[key] || '').toString().toLowerCase();
      return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    });
  }

  getCurrentLanguage() {
    return this.langService.getCurrentLanguage();
  }

  get optionLabel(): string {
    return this.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  get currentLang(): string {
    return this.getCurrentLanguage();
  }

  onStartDateSelect(selectedDate: Date): void {
    const newStartDate = selectedDate ?? null;
    this.minEndDate = newStartDate ? new Date(newStartDate) : null;

    const endDate = (this.form.get('endDate')?.value as Date | null) ?? null;
    if (newStartDate && endDate && new Date(endDate) < newStartDate) {
      this.form.get('endDate')?.setValue(null);
    }

    const effectiveEndDate =
      newStartDate && endDate && new Date(endDate) < newStartDate ? null : endDate;

    this.refreshAllowedWeekDays(newStartDate, effectiveEndDate);
    this.validateAndUpdateWorkingDays_WithDates(newStartDate, effectiveEndDate);
  }

  onEndDateSelect(selectedDate: Date): void {
    const newEndDate = selectedDate ?? null;
    this.maxStartDate = newEndDate ? new Date(newEndDate) : null;

    const startDate = (this.form.get('startDate')?.value as Date | null) ?? null;
    if (newEndDate && startDate && new Date(startDate) > newEndDate) {
      this.form.get('startDate')?.setValue(null);
    }

    const effectiveStartDate =
      newEndDate && startDate && new Date(startDate) > newEndDate ? null : startDate;

    this.refreshAllowedWeekDays(effectiveStartDate, newEndDate);
    this.validateAndUpdateWorkingDays_WithDates(effectiveStartDate, newEndDate);
  }

  private validateAndUpdateWorkingDays_WithDates(
    startDate: Date | null,
    endDate: Date | null
  ): void {
    if (!startDate || !endDate) return;

    const allowedDays = this.getAllowedWeekDaysInRange(startDate, endDate);
    this.selectedWorkingDays = this.selectedWorkingDays.filter((day) => allowedDays.includes(day));
    this.updateEmployeeWorkingDaysInForm();
  }

  private refreshAllowedWeekDays(startDate: Date | null, endDate: Date | null): void {
    if (!startDate || !endDate) {
      this.allowedWeekDaysInRange = [];
      return;
    }
    this.allowedWeekDaysInRange = this.getAllowedWeekDaysInRange(startDate, endDate);
  }

  onWorkShiftTypeChange(type: WorkShiftType): void {
    const presenceTimeCtrl = this.form.get('presenceInquiryTime');
    const presenceBufferCtrl = this.form.get('presenceInquiryBuffer');
    const endDateCtrl = this.form.get('endDate');
    const userIdsCtrl = this.form.get('userIdsArray');
    const workingDaysCtrl = this.form.get('employeeWorkingDays');

    // Presence fields are not yet implemented for any active type
    presenceTimeCtrl?.disable();
    presenceBufferCtrl?.disable();
    presenceTimeCtrl?.clearValidators();
    presenceBufferCtrl?.clearValidators();
    presenceTimeCtrl?.setValue(null);
    presenceBufferCtrl?.setValue(null);

    if (type === WorkShiftType.Rotating) {
      endDateCtrl?.clearValidators();
    } else {
      // Standard (1) and WeekOnWeekOff24 (3) both show the upper section
      endDateCtrl?.clearValidators();
      this.selectedWorkingDays = [...this.previousStandardWorkingDays];
      this.validateAndUpdateWorkingDays();
      this.updateEmployeeWorkingDaysInForm();
    }

    // Single-shift section validators: required only when upper section is visible
    if (type === WorkShiftType.Standard || type === WorkShiftType.WeekOnWeekOff24) {
      userIdsCtrl?.setValidators([Validators.required]);
      workingDaysCtrl?.setValidators([this.validateWorkingDays()]);
    } else {
      userIdsCtrl?.clearValidators();
      workingDaysCtrl?.clearValidators();
    }

    presenceTimeCtrl?.updateValueAndValidity();
    presenceBufferCtrl?.updateValueAndValidity();
    endDateCtrl?.updateValueAndValidity();
    userIdsCtrl?.updateValueAndValidity();
    workingDaysCtrl?.updateValueAndValidity();
  }

  private selectAllWorkingDays(): void {
    this.selectedWorkingDays = this.weekDays.map((day) => day.value);
    this.validateAndUpdateWorkingDays();
    this.updateEmployeeWorkingDaysInForm();
  }

  private validateAndUpdateWorkingDays(): void {
    const currentType = this.form.get('workShiftType')?.value;
    if (
      currentType === WorkShiftType.WeekOnWeekOff ||
      currentType === WorkShiftType.WeekOnWeekOff24
    ) {
      this.selectedWorkingDays = this.weekDays.map((day) => day.value);
      this.updateEmployeeWorkingDaysInForm();
      return;
    }

    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;

    if (startDate && endDate) {
      const allowedDays = this.getAllowedWeekDaysInRange(startDate, endDate);
      this.selectedWorkingDays = this.selectedWorkingDays.filter((day) =>
        allowedDays.includes(day)
      );
      this.updateEmployeeWorkingDaysInForm();
    }
  }

  private updateDateConstraints(): void {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;
    if (startDate) this.minEndDate = new Date(startDate);
    if (endDate) this.maxStartDate = new Date(endDate);
  }

  get fkShiftIdControl() { return this.form.get('fkShiftId') as FormControl; }
  get startDateControl() { return this.form.get('startDate') as FormControl; }
  get endDateControl() { return this.form.get('endDate') as FormControl; }
  get userIdsArrayControl() { return this.form.get('userIdsArray') as FormControl; }
  get employeeWorkingDaysControl() { return this.form.get('employeeWorkingDays') as FormControl; }
  get presenceInquiryTimeControl() { return this.form.get('presenceInquiryTime') as FormControl; }
  get presenceInquiryBufferControl() { return this.form.get('presenceInquiryBuffer') as FormControl; }
  get workShiftTypeControl() { return this.form.get('workShiftType') as FormControl; }

  get isSingleShiftType(): boolean {
    const type = this.form?.get('workShiftType')?.value;
    return type === WorkShiftType.Standard || type === WorkShiftType.WeekOnWeekOff24;
  }

  get isRotatingType(): boolean {
    return this.form?.get('workShiftType')?.value === WorkShiftType.Rotating;
  }

  weekDays = weekDays;

  getDateToIsRequired() {
    return this.workShiftTypeControl.value == this.workShiftType.Standard ? '' : 'required';
  }

  getSelectedShiftObject(controlName: string) {
    let control = this.form?.get(controlName)
    return this.shifts.find(x => x.id == control?.value);
  }
}
