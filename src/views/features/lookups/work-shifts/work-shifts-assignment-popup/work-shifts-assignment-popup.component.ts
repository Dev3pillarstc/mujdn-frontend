import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DialogRef } from '@angular/cdk/dialog';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import UserWorkShift from '@/models/features/lookups/work-shifts/user-work-shifts';
import { M } from '@angular/material/dialog.d-B5HZULyo';
import { Observable } from 'rxjs';
import { AlertService } from '@/services/shared/alert.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { TranslatePipe } from '@ngx-translate/core';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import Shift from '@/models/features/lookups/work-shifts/shift';
import { WeekDaysEnum } from '@/enums/week-days-enum';
import { weekDays } from '@/utils/general-helper';
import { WorkDaysSetting } from '@/models/features/setting/work-days-setting';
import { UserWorkShiftService } from '@/services/features/lookups/user-workshift.service';
import { PaginationParams } from '@/models/shared/pagination-params';
import { DIALOG_ENUM } from '@/enums/dialog-enum';

@Component({
  selector: 'app-work-shifts-assignment-popup',
  imports: [
    FormsModule,
    Select,
    DatePickerModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
    TranslatePipe,
    ValidationMessagesComponent,
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
  filteredUsersProfiles: UsersWithDepartmentLookup[] = [];
  departments: BaseLookupModel[] = [];
  shifts: Shift[] = [];
  form!: FormGroup;
  viewMode!: ViewModeEnum;
  fb = inject(FormBuilder);
  alertService = inject(AlertService);
  langService = inject(LanguageService);
  isCreateMode = false;
  selectedWorkingDays: number[] = [];
  userWorkShiftService = inject(UserWorkShiftService);
  // Date constraints
  minEndDate: Date | null = null;
  maxStartDate: Date | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override initPopup(): void {
    // Initialize model - either from data or create new instance
    this.model = this.data.model || new UserWorkShift();
    this.usersProfiles = this.data.lookups?.usersProfiles || [];
    this.departments = this.data.lookups?.departments || [];
    this.shifts = this.data.lookups?.shifts || [];
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode === ViewModeEnum.CREATE;

    this.usersProfiles = this.sortByName(this.usersProfiles, this.optionLabel);
    this.filteredUsersProfiles = this.usersProfiles;
    this.departments = this.sortByName(this.departments, this.optionLabel);
    this.shifts = this.sortByName(this.shifts, this.optionLabel);

    if (this.isCreateMode) {
      // Initialize selected working days
      this.workDays = this.data.lookups?.defaultWorkDays[0]!;
      this.initializeSelectedWorkingDays();
    } else {
      // For edit mode, initialize working days from model
      this.initializeSelectedWorkingDays();
      // Pre-filter employees if we have department info
      this.preFilterEmployeesForEditMode();
    }
  }


  private initializeSelectedWorkingDays(): void {
    // Reset
    this.selectedWorkingDays = [];

    if (this.model.employeeWorkingDays) {
      // Priority 1: Parse from model string
      this.selectedWorkingDays = this.model.employeeWorkingDays
        .split(',')
        .map((day) => parseInt(day.trim(), 10))
        .filter((day) => !isNaN(day));
    } else if (this.workDays) {
      // Priority 2: Map boolean flags to enum values
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
  }

  override buildForm(): void {
    this.form = this.fb.group({
      ...this.model.buildForm(),
      employeeWorkingDays: [
        this.selectedWorkingDays.join(','),
        [this.validateWorkingDays()], // Use array syntax for validators
      ],
      departmentId: [null],
    });

    // Set the correct values for dropdowns after form is built
    this.setDropdownValues();
    this.updateDateConstraints();
  }

  // Update this method in initPopup()
  private preFilterEmployeesForEditMode(): void {
    if (!this.isCreateMode && this.model.fkAssignedUserId) {
      // Find the selected employee to get their department
      const selectedEmployee = this.usersProfiles.find(
        (emp) => emp.id === this.model.fkAssignedUserId
      );
      if (selectedEmployee && selectedEmployee.departmentId) {
        // Just filter the employees, don't do form operations here
        this.filteredUsersProfiles = this.usersProfiles.filter(
          (emp) => emp.departmentId === selectedEmployee.departmentId
        );
      }
    }
  }

  // Update setDropdownValues to handle the department filtering after form is built
  private setDropdownValues(): void {
    if (!this.isCreateMode) {
      // Set shift
      if (this.model.fkShiftId) {
        this.form.get('fkShiftId')?.setValue(this.model.fkShiftId);
      }

      // Set employee
      if (this.model.fkAssignedUserId) {
        const selectedEmployee = this.usersProfiles.find(
          (emp) => emp.id === this.model.fkAssignedUserId
        );
        if (selectedEmployee) {
          this.form.get('fkAssignedUserId')?.setValue(selectedEmployee.id);
          // 👇 auto-set department if found
          if (selectedEmployee.departmentId) {
            this.form.get('departmentId')?.setValue(selectedEmployee.departmentId);
            // 👇 Now it's safe to call filterEmployeesByDepartment since form is built
            this.filterEmployeesByDepartment(selectedEmployee.departmentId);
          }
        }
      }

      // Set dates
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
    }
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

    // Mark the field as touched so validation messages appear
    this.form.get('employeeWorkingDays')?.markAsTouched();
  }

  private validateWorkingDays(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const selectedDays = value.split(',').filter((day: string) => day.trim() !== '');

      if (selectedDays.length === 0) {
        return { required: true }; // This should match your ValidationErrorKeyEnum.REQUIRED
      }

      return null;
    };
  }

  private updateEmployeeWorkingDaysInForm(): void {
    const workingDaysString = this.selectedWorkingDays.join(',');
    this.form.get('employeeWorkingDays')?.setValue(workingDaysString);
    this.form.get('employeeWorkingDays')?.updateValueAndValidity();
  }
  onSaveClick(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });

    if (this.form.valid) {
      this.prepareModel(this.model, this.form);

      if (this.model.id) {
        // Update existing shift
        this.userWorkShiftService.update(this.model).subscribe({
          next: () => {
            this.dialogRef.close(DIALOG_ENUM.OK);
          },
          error: (err) => {
            this.save$.error(err);
          },
        });
      } else {
        // Assign new shift
        this.userWorkShiftService.assignUserShift(this.model).subscribe({
          next: () => {
            this.dialogRef.close(DIALOG_ENUM.OK);
          },
          error: (err) => {
            this.save$.error(err);
          },
        });
      }
    }
  }

  isWorkingDaySelected(dayValue: number): boolean {
    return this.selectedWorkingDays.includes(dayValue);
  }

  // NEW METHOD: Check if a weekday should be disabled based on date range
  isWeekDayDisabled(dayValue: number): boolean {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;

    // If only start date is selected or no dates selected, don't disable any days
    if (!startDate || !endDate) {
      return false;
    }

    // Get the allowed weekdays for the date range
    const allowedDays = this.getAllowedWeekDaysInRange(startDate, endDate);

    // Disable if the day is not in the allowed range
    return !allowedDays.includes(dayValue);
  }

  // NEW METHOD: Get all weekdays that fall within the date range
  private getAllowedWeekDaysInRange(startDate: Date, endDate: Date): number[] {
    const allowedDays = new Set<number>();
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    // Iterate through each day in the range
    while (currentDate <= end) {
      // JavaScript's getDay() returns 0 for Sunday, 1 for Monday, etc.
      // Your WeekDaysEnum: SUNDAY = 0, MONDAY = 1, TUESDAY = 2, WEDNESDAY = 3, THURSDAY = 4, FRIDAY = 5, SATURDAY = 6
      const jsDay = currentDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

      // Your enum matches JavaScript's getDay() exactly, so no conversion needed
      allowedDays.add(jsDay);

      // Move to next day
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
    // Only update the specific fields that should be sent to the API
    const formValue = form.value;

    // Update only the necessary properties
    this.model.startDate = formValue.startDate;
    this.model.endDate = formValue.endDate;
    this.model.employeeWorkingDays = formValue.employeeWorkingDays;
    this.model.fkAssignedUserId = formValue.fkAssignedUserId;
    this.model.fkShiftId = formValue.fkShiftId;

    return this.model;
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

  onDepartmentChange(event: any) {
    console.log('Department change event:', event);
    const departmentId = event.value;
    console.log('Selected department ID:', departmentId);

    if (departmentId) {
      this.filterEmployeesByDepartment(departmentId);
    } else {
      // If no department selected, show all employees
      this.filteredUsersProfiles = [...this.usersProfiles];
    }
  }
  filterEmployeesByDepartment(departmentId: number | any) {
    // Handle the case where departmentId might be an event object or the ID directly
    const actualDepartmentId = typeof departmentId === 'object' && departmentId?.id
      ? departmentId.id
      : departmentId;

    console.log('Filtering by department ID:', actualDepartmentId);
    console.log('Available users:', this.usersProfiles);

    // Filter employees by the selected department
    this.filteredUsersProfiles = this.usersProfiles.filter(
      (emp) => emp.departmentId === actualDepartmentId
    );

    console.log('Filtered users:', this.filteredUsersProfiles);

    // Only check form if it's initialized
    if (this.form) {
      // Check if the currently selected employee belongs to the new department
      const selectedEmployeeId = this.form.get('fkAssignedUserId')?.value;

      if (selectedEmployeeId) {
        const selectedEmployee = this.usersProfiles.find(
          (emp) => emp.id === selectedEmployeeId
        );

        // If the selected employee doesn't belong to the new department, clear the selection
        if (selectedEmployee && selectedEmployee.departmentId !== actualDepartmentId) {
          this.form.get('fkAssignedUserId')?.setValue(null);
          this.form.get('fkAssignedUserId')?.markAsTouched();
        }
      }
    }
  }
  onStartDateSelect(selectedDate: Date): void {
    if (selectedDate) {
      this.minEndDate = new Date(selectedDate);

      const currentEndDate = this.form.get('endDate')?.value;
      if (currentEndDate && new Date(currentEndDate) < selectedDate) {
        this.form.get('endDate')?.setValue(null);
      }
    } else {
      this.minEndDate = null;
    }

    // Clear selected working days that are no longer valid
    this.validateAndUpdateWorkingDays();
  }

  onEndDateSelect(selectedDate: Date): void {
    if (selectedDate) {
      this.maxStartDate = new Date(selectedDate);

      const currentStartDate = this.form.get('startDate')?.value;
      if (currentStartDate && new Date(currentStartDate) > selectedDate) {
        this.form.get('startDate')?.setValue(null);
      }
    } else {
      this.maxStartDate = null;
    }

    // Clear selected working days that are no longer valid
    this.validateAndUpdateWorkingDays();
  }

  // NEW METHOD: Remove selected working days that are not allowed in the new date range
  private validateAndUpdateWorkingDays(): void {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;

    if (startDate && endDate) {
      const allowedDays = this.getAllowedWeekDaysInRange(startDate, endDate);

      // Remove any selected days that are not allowed in the new range
      this.selectedWorkingDays = this.selectedWorkingDays.filter((day) =>
        allowedDays.includes(day)
      );

      this.updateEmployeeWorkingDaysInForm();
    }
  }

  private updateDateConstraints(): void {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;

    if (startDate) {
      this.minEndDate = new Date(startDate);
    }

    if (endDate) {
      this.maxStartDate = new Date(endDate);
    }
  }

  get fkShiftIdControl() {
    return this.form.get('fkShiftId') as FormControl;
  }
  get startDateControl() {
    return this.form.get('startDate') as FormControl;
  }
  get endDateControl() {
    return this.form.get('endDate') as FormControl;
  }
  get fkAssignedUserIdControl() {
    return this.form.get('fkAssignedUserId') as FormControl;
  }
  get employeeWorkingDaysControl() {
    return this.form.get('employeeWorkingDays') as FormControl;
  }

  weekDays = weekDays;
}
