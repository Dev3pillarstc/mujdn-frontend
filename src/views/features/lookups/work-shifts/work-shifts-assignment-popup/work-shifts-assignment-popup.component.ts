import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { Accordion } from 'primeng/accordion';
import { AccordionPanel } from 'primeng/accordion';
import { AccordionHeader } from 'primeng/accordion';
import { AccordionContent } from 'primeng/accordion';
import { DatePickerModule } from 'primeng/datepicker';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';

import { forkJoin, Observable } from 'rxjs';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { DepartmentEmployees } from '@/models/features/lookups/work-shifts/department-employees';
import UserWorkShift from '@/models/features/lookups/work-shifts/user-work-shifts';
import { WorkShiftType } from '@/enums/work-shift-type';

@Component({
  selector: 'app-work-shifts-assignment-popup',
  imports: [
    CommonModule,
    FormsModule,
    Select,
    MultiSelect,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    DatePickerModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
    TranslatePipe,
    ValidationMessagesComponent,
    InputNumberModule,
  ],
  templateUrl: './work-shifts-assignment-popup.component.html',
  styleUrl: './work-shifts-assignment-popup.component.scss',
})
export class WorkShiftsAssignmentPopupComponent
  extends BasePopupComponent<UserWorkShift>
  implements OnInit
{
  model!: UserWorkShift;
  usersProfiles: UsersWithDepartmentLookup[] = [];
  workDays: WorkDaysSetting = new WorkDaysSetting();
  filteredUsersProfiles: UsersWithDepartmentLookup[] = [];
  departments: BaseLookupModel[] = [];
  shifts: Shift[] = [];
  departmentEmployeesGroups: DepartmentEmployees[] = []; // Grouped employees by department
  workShiftType = WorkShiftType;
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
      departmentIdsArray: [[]],
      userIdsArray: [[]],
    });

    // Watch for employee selection changes to update the accordion
    this.form.get('userIdsArray')?.valueChanges.subscribe((userIds) => {
      this.onEmployeeSelectionChange(userIds);
    });

    // Set the correct values for dropdowns after form is built
    this.setDropdownValues();
    this.updateDateConstraints();
  }

  // Update setDropdownValues to handle the department filtering after form is built
  private setDropdownValues(): void {
    if (!this.isCreateMode) {
      // Set shift
      if (this.model.fkShiftId) {
        this.form.get('fkShiftId')?.setValue(this.model.fkShiftId);
      }

      // Set employees
      const assignedUserIds = this.model.assignedUserIds || [];
      if (assignedUserIds.length > 0) {
        this.form.get('userIdsArray')?.setValue(assignedUserIds);

        // Find departments for these users to auto-select them
        const departmentsToSelect = new Set<number>();
        assignedUserIds.forEach((userId) => {
          const emp = this.usersProfiles.find((u) => u.id === userId);
          if (emp && emp.departmentId) {
            departmentsToSelect.add(emp.departmentId);
          }
        });

        if (departmentsToSelect.size > 0) {
          const deptArray = Array.from(departmentsToSelect);
          this.form.get('departmentIdsArray')?.setValue(deptArray);
          // Filter employees to ensure selected ones are visible in dropdown
          this.filterEmployeesByDepartment(deptArray);
        }
      }

      // Set workShiftType
      if (this.model.workShiftType) {
        this.form.get('workShiftType')?.setValue(this.model.workShiftType);
      } else {
        this.form.get('workShiftType')?.setValue(WorkShiftType.Standard);
      }

      // Set presenceInquiryTime
      if (this.model.presenceInquiryTime) {
        this.form
          .get('presenceInquiryTime')
          ?.setValue(new Date('1970-01-01T' + this.model.presenceInquiryTime));
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
      const formValue = this.form.value;
      const userIds = formValue.userIdsArray || [];

      if (userIds.length === 0) {
        // Should be caught by validation, but double check
        return;
      }

      if (this.model.id && userIds.length === 1) {
        // Update data specifically for single edit mode if needed,
        // though typically edit is 1-to-1.
        // If edit mode is single user:
        this.prepareModel(this.model, this.form);
        this.userWorkShiftService.update(this.model).subscribe({
          next: () => {
            this.dialogRef.close(DIALOG_ENUM.OK);
          },
          error: (err) => {
            this.save$.error(err);
          },
        });
      } else {
        // Bulk Create / Assign
        const newModel = new UserWorkShift();
        this.prepareModel(newModel, this.form);
        // We now use assignedUserIds for bulk assignment
        newModel.assignedUserIds = userIds;

        this.userWorkShiftService.assignUserShift(newModel).subscribe({
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

  override saveFail(error: Error): void {}

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

    // Convert time to string HH:mm:ss if present
    if (formValue.presenceInquiryTime instanceof Date) {
      const time = formValue.presenceInquiryTime;
      model.presenceInquiryTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
    } else {
      model.presenceInquiryTime = formValue.presenceInquiryTime;
    }
    model.presenceInquiryBuffer = formValue.presenceInquiryBuffer;

    // Convert array to single value (take first selected user)
    const userIds = formValue.userIdsArray || [];
    model.fkAssignedUserId = userIds.length > 0 ? userIds[0] : null;
    model.assignedUserIds = userIds;

    model.fkShiftId = formValue.fkShiftId;

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

  onDepartmentChange(event: any) {
    const departmentIds = event.value || [];

    if (departmentIds.length > 0) {
      this.filterEmployeesByDepartment(departmentIds);
    } else {
      // If no department selected, show all employees
      this.filteredUsersProfiles = [...this.usersProfiles];
    }

    // Clear employee selection when departments change
    // If we want to keep selected employees even if department is unchecked, remove this.
    // However, usually if you uncheck a department, you might expect its users to be removed?
    // Requirement says: "deleting all employees of department resets the department and employees".
    // It doesn't explicitly say changing department dropdown should clear employees,
    // but usually it filters. Let's keep existing logic but refining it.

    // If I unselect a department, I should probably remove its employees from selection?
    // Or just filter the dropdown?
    // Current implementation only filters the dropdown options.
    // Let's ensure we remove employees that are no longer visible if that's desired,
    // OR just keep them.
    // The requirement "When selecting an employee, add it down in the accordion realated to the department"
    // suggests the accordion is the source of truth for "selected".

    // If I clear departments, I probably want to clear list?
    if (departmentIds.length === 0) {
      this.form.get('userIdsArray')?.setValue([]);
    } else {
      // Optional: Remove employees not in selected departments?
      // For now, let's just filter the dropdown list.
      // The user might want to keep previously selected users from other departments.
      // But typically "Filter" implies selection constraint.
      const currentSelection = this.form.get('userIdsArray')?.value || [];
      const validEmployees = this.usersProfiles.filter(
        (u) => departmentIds.includes(u.departmentId) || currentSelection.includes(u.id)
      );
      // Actually, usually the dropdown items are what you CAN select.
      // If I have User A (Dept 1) selected, and I uncheck Dept 1, User A is still selected in model.
      // But logic at line 418 filters them out of the control value.
    }
  }
  filterEmployeesByDepartment(departmentIds: number[] | any) {
    // Handle the case where departmentIds might be an event object or the IDs directly
    const actualDepartmentIds = Array.isArray(departmentIds) ? departmentIds : [departmentIds];

    // Filter employees by the selected departments
    this.filteredUsersProfiles = this.usersProfiles.filter((emp) =>
      actualDepartmentIds.includes(emp.departmentId)
    );

    // Only check form if it's initialized
    if (this.form) {
      // Check if the currently selected employees belong to the new departments
      const selectedEmployeeIds = this.form.get('userIdsArray')?.value || [];

      if (selectedEmployeeIds.length > 0) {
        // Filter out employees that don't belong to the selected departments
        const validEmployeeIds = selectedEmployeeIds.filter((empId: number) => {
          const employee = this.usersProfiles.find((emp) => emp.id === empId);
          return employee && actualDepartmentIds.includes(employee.departmentId);
        });

        // Update the form with only valid employees
        if (validEmployeeIds.length !== selectedEmployeeIds.length) {
          this.form.get('userIdsArray')?.setValue(validEmployeeIds);
          this.form.get('userIdsArray')?.markAsTouched();
        }
      }
    }
  }

  onEmployeeSelectionChange(userIds: number[]): void {
    // Re-calculate the groups
    this.updateDepartmentEmployeesGroups(userIds || []);
  }

  updateDepartmentEmployeesGroups(selectedUserIds: number[]): void {
    const groupsMap = new Map<number, DepartmentEmployees>();
    const selectedUsers = this.usersProfiles.filter((user) => selectedUserIds.includes(user.id!));

    selectedUsers.forEach((user) => {
      const deptId = user.departmentId;
      if (!deptId) return;

      // Find department info. If user has no department, maybe group under "Other"?
      // Assuming all have department based on previous code.
      const department = this.departments.find((d) => d.id === deptId);

      if (department) {
        if (!groupsMap.has(deptId)) {
          groupsMap.set(deptId, {
            department: department,
            employees: [],
          });
        }
        groupsMap.get(deptId)!.employees.push(user);
      }
    });

    // Convert map to array and sort
    this.departmentEmployeesGroups = this.sortDepartments(Array.from(groupsMap.values()));
  }

  private sortDepartments(groups: DepartmentEmployees[]): DepartmentEmployees[] {
    // Sort by department name
    return groups.sort((a, b) => {
      const nameA =
        (this.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC
          ? a.department.nameAr
          : a.department.nameEn) || '';
      const nameB =
        (this.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC
          ? b.department.nameAr
          : b.department.nameEn) || '';
      return nameA.localeCompare(nameB);
    });
  }

  removeEmployee(userId: number | undefined): void {
    if (!userId) return;
    const currentIds = this.form.get('userIdsArray')?.value as number[];
    const newIds = currentIds.filter((id) => id !== userId);
    this.form.get('userIdsArray')?.setValue(newIds);
  }

  removeAllEmployeesFromDepartment(departmentId: number | undefined): void {
    if (!departmentId) return;

    // Get users to remove
    // We can just filter the current selection
    const currentIds = this.form.get('userIdsArray')?.value as number[];
    const usersKeep = currentIds.filter((id) => {
      const user = this.usersProfiles.find((u) => u.id === id);
      return user && user.departmentId !== departmentId;
    });
    this.form.get('userIdsArray')?.setValue(usersKeep);

    // Reseting department selection if needed?
    // "deleting all employees of department resets the department and employees"
    // This implies if I remove all employees of Dept X, maybe uncheck Dept X from filter?
    // Let's do that if logic requires.
    // Also valid: just removing employees.

    // If we want to uncheck the department from the top filter:
    const currentDepartments = this.form.get('departmentIdsArray')?.value as number[];
    if (currentDepartments.includes(departmentId)) {
      const newDepartments = currentDepartments.filter((d) => d !== departmentId);
      this.form.get('departmentIdsArray')?.setValue(newDepartments);
      // Trigger filter update
      this.onDepartmentChange({ value: newDepartments });
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
  get userIdsArrayControl() {
    return this.form.get('userIdsArray') as FormControl;
  }
  get departmentIdsArrayControl() {
    return this.form.get('departmentIdsArray') as FormControl;
  }
  get employeeWorkingDaysControl() {
    return this.form.get('employeeWorkingDays') as FormControl;
  }

  getSelectedDepartmentsLabel(): string {
    const selectedIds = this.form?.get('departmentIdsArray')?.value || [];
    const count = selectedIds.length;

    if (count === 0) return '';

    const currentLang = this.getCurrentLanguage();
    if (currentLang === LANGUAGE_ENUM.ARABIC) {
      return `${count} قسم محدد`;
    } else {
      return `${count} department${count > 1 ? 's' : ''} selected`;
    }
  }

  getSelectedEmployeesLabel(): string {
    const selectedIds = this.form?.get('userIdsArray')?.value || [];
    const count = selectedIds.length;

    if (count === 0) return '';

    const currentLang = this.getCurrentLanguage();
    if (currentLang === LANGUAGE_ENUM.ARABIC) {
      return `${count} موظف محدد`;
    } else {
      return `${count} employee${count > 1 ? 's' : ''} selected`;
    }
  }

  weekDays = weekDays;
}
