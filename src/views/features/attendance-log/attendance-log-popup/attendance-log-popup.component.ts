import { Component, Inject, inject, OnInit } from '@angular/core';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { AttendanceLog } from '@/models/features/attendance/attendance-log/attendance-log';
import { AttendanceService } from '@/services/features/attendance.service';
import { AlertService } from '@/services/shared/alert.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';

@Component({
  selector: 'app-attendance-log-popup',
  imports: [
    Select,
    DatePickerModule,
    ReactiveFormsModule,
    TranslatePipe,
    ValidationMessagesComponent,
  ],
  templateUrl: './attendance-log-popup.component.html',
  styleUrl: './attendance-log-popup.component.scss',
})
export class AttendanceLogPopupComponent
  extends BasePopupComponent<AttendanceLog>
  implements OnInit
{
  declare model: AttendanceLog;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(AttendanceService);
  fb = inject(FormBuilder);

  departments: BaseLookupModel[] = [];
  employees: UsersWithDepartmentLookup[] = [];
  selectedDate: Date | undefined;
  selectedTime: Date | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  get departmentControl() {
    return this.form.get('departmentId') as FormControl;
  }

  get employeeControl() {
    return this.form.get('employeeId') as FormControl;
  }

  get identificationNumberControl() {
    return this.form.get('identificationNumber') as FormControl;
  }

  get swipeTimeControl() {
    return this.form.get('swipeTime') as FormControl;
  }

  override saveFail(error: Error): void {
    this.alertService.showErrorMessage({ messages: ['COMMON.SAVE_FAILED'] });
  }

  override prepareModel(
    model: AttendanceLog,
    form: FormGroup
  ): AttendanceLog | Observable<AttendanceLog> {
    // Combine date and time into swipeTime
    const combinedDateTime = this.combineDateTime(this.selectedDate, this.selectedTime);

    // Get selected employee's national ID
    const selectedEmployee = this.employees.find((emp) => emp.id === form.value.employeeId);
    const identificationNumber = selectedEmployee?.nationalId || '';

    this.model = Object.assign(model, {
      ...form.value,
      swipeTime: combinedDateTime,
      identificationNumber: identificationNumber,
    });

    return this.model;
  }

  override initPopup() {
    this.model = this.data.model;
    this.departments = this.data.lookups?.departments ?? [];
    this.employees = this.data.lookups?.employees ?? [];

    // Initialize date and time from existing swipeTime if in edit mode
    if (this.model.swipeTime) {
      const existingDateTime = new Date(this.model.swipeTime);
      this.selectedDate = existingDateTime;
      this.selectedTime = existingDateTime;
    }
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm(this.data.viewMode));
  }

  beforeSave(model: AttendanceLog, form: FormGroup) {
    // Validate that both date and time are selected
    if (!this.selectedDate || !this.selectedTime) {
      this.alertService.showErrorMessage({ messages: ['ATTENDANCE_LOG_PAGE.DATE_TIME_REQUIRED'] });
      return false;
    }

    return form.valid;
  }

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  onEmployeeChange(employeeId: number) {
    const selectedEmployee = this.employees.find((emp) => emp.id === employeeId);
    if (selectedEmployee) {
      // Update the identification number when employee changes
      this.identificationNumberControl?.setValue(selectedEmployee.nationalId);
    }
  }

  onDateChange(date: Date) {
    this.selectedDate = date;
    console.log('Date', this.selectedDate);
    this.updateSwipeTime();
  }

  onTimeChange(time: Date) {
    this.selectedTime = time;
    console.log('Time', this.selectedTime);
    this.updateSwipeTime();
  }

  private updateSwipeTime() {
    if (this.selectedDate && this.selectedTime) {
      const combinedDateTime = this.combineDateTime(this.selectedDate, this.selectedTime);
      this.swipeTimeControl?.setValue(combinedDateTime);
    }
  }

  private combineDateTime(date: Date | undefined, time: Date | undefined): string {
    if (!date || !time) return '';

    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(time.getSeconds());

    return combined.toISOString();
  }

  getPropertyName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }

  // Filter employees based on selected department
  getFilteredEmployees(): UsersWithDepartmentLookup[] {
    const selectedDepartmentId = this.departmentControl?.value;
    if (!selectedDepartmentId) {
      return this.employees;
    }

    return this.employees.filter((emp) => emp.departmentId === selectedDepartmentId);
  }
}
