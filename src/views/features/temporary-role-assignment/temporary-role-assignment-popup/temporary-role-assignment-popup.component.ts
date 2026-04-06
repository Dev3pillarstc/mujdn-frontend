import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { ValidationErrorKeyEnum } from '@/enums/validation-error-key-enum';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { TemporaryRoleAssignment } from '@/models/features/temporary-role-assignment/temporary-role-assignment';
import { TemporaryRoleAssignmentService } from '@/services/features/temporary-role-assignment.service';
import { AlertService } from '@/services/shared/alert.service';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { RequiredMarkerDirective } from '../../../../directives/required-marker.directive';

@Component({
  selector: 'app-temporary-role-assignment-popup',
  imports: [
    Select,
    DatePickerModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
    TranslatePipe,
    ValidationMessagesComponent,
  ],
  templateUrl: './temporary-role-assignment-popup.component.html',
  styleUrl: './temporary-role-assignment-popup.component.scss',
})
export class TemporaryRoleAssignmentPopupComponent
  extends BasePopupComponent<TemporaryRoleAssignment>
  implements OnInit
{
  declare model: TemporaryRoleAssignment;
  declare form: FormGroup;
  declare viewMode: ViewModeEnum;

  service = inject(TemporaryRoleAssignmentService);
  alertService = inject(AlertService);
  fb = inject(FormBuilder);

  employees: UsersWithDepartmentLookup[] = [];
  isCreateMode = false;
  dateToMinDate: Date | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  get employeeControl(): FormControl {
    return this.form.get('fkUserProfileId') as FormControl;
  }

  get dateFromControl(): FormControl {
    return this.form.get('dateFrom') as FormControl;
  }

  get dateToControl(): FormControl {
    return this.form.get('dateTo') as FormControl;
  }

  override initPopup(): void {
    this.model = this.data.model;
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode === ViewModeEnum.CREATE;
    this.employees = this.data.lookups?.employees ?? [];
  }

  override buildForm(): void {
    this.form = this.fb.group(this.model.buildForm());
    this.applyEditabilityRules();
    this.setupDateValidation();
  }

  override saveFail(_: Error): void {
    this.alertService.showErrorMessage({ messages: ['COMMON.ERROR'] });
  }

  override prepareModel(
    model: TemporaryRoleAssignment,
    form: FormGroup
  ): TemporaryRoleAssignment | Observable<TemporaryRoleAssignment> {
    this.model = Object.assign(model, { ...form.getRawValue() });
    return this.model;
  }

  beforeSave(_: TemporaryRoleAssignment, form: FormGroup): boolean {
    this.syncDateRangeValidation();

    if (this.model.isDateToOnlyEditable) {
      const dateTo = this.normalizeDate(form.getRawValue().dateTo);

      if (dateTo && dateTo <= this.today) {
        this.alertService.showErrorMessage({
          messages: ['TEMPORARY_ROLE_ASSIGNMENT_PAGE.END_DATE_MUST_BE_AFTER_TODAY'],
        });
        return false;
      }
    }

    return form.valid;
  }

  afterSave() {
    this.alertService.showSuccessMessage({ messages: ['COMMON.SAVED_SUCCESSFULLY'] });
  }

  getPropertyName(): string {
    return this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
      ? 'nameEn'
      : 'nameAr';
  }

  private applyEditabilityRules(): void {
    if (this.model.isDateToOnlyEditable) {
      this.employeeControl.disable();
      this.dateFromControl.disable();
    }
  }

  private setupDateValidation(): void {
    this.updateDateToMinDate();
    this.syncDateRangeValidation();
    this.dateFromControl.valueChanges.subscribe(() => {
      this.updateDateToMinDate();
      this.syncDateRangeValidation();
    });
    this.dateToControl.valueChanges.subscribe(() => this.syncDateRangeValidation());
  }

  private updateDateToMinDate(): void {
    if (this.model.isDateToOnlyEditable) {
      const tomorrow = new Date(this.today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.dateToMinDate = tomorrow;
      return;
    }

    this.dateToMinDate = this.normalizeDate(this.form.getRawValue().dateFrom);
  }

  private syncDateRangeValidation(): void {
    const dateFrom = this.normalizeDate(this.form.getRawValue().dateFrom);
    const dateTo = this.normalizeDate(this.form.getRawValue().dateTo);
    const errors = { ...(this.dateToControl.errors ?? {}) };

    delete errors[ValidationErrorKeyEnum.START_AFTER_END];

    if (dateFrom && dateTo && dateTo < dateFrom) {
      this.dateToControl.setErrors({
        ...errors,
        [ValidationErrorKeyEnum.START_AFTER_END]: true,
      });
      return;
    }

    this.dateToControl.setErrors(Object.keys(errors).length ? errors : null);
  }

  private normalizeDate(value: Date | string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private get today(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
}
