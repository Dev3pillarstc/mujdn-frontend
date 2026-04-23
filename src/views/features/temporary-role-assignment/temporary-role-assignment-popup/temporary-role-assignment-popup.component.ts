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
  dateFromMinDate = this.getToday();
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

  override saveFail(_: Error): void {}

  override prepareModel(
    model: TemporaryRoleAssignment,
    form: FormGroup
  ): TemporaryRoleAssignment | Observable<TemporaryRoleAssignment> {
    this.model = Object.assign(model, { ...form.getRawValue() });
    return this.model;
  }

  beforeSave(_: TemporaryRoleAssignment, form: FormGroup): boolean {
    this.syncDateValidation();
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
    this.syncDateValidation();
    this.dateFromControl.valueChanges.subscribe(() => {
      this.updateDateToMinDate();
      this.syncDateValidation();
    });
    this.dateToControl.valueChanges.subscribe(() => this.syncDateValidation());
  }

  private updateDateToMinDate(): void {
    if (this.model.isDateToOnlyEditable) {
      this.dateToMinDate = this.dateFromMinDate;
      return;
    }

    const dateFrom = this.normalizeDate(this.form.getRawValue().dateFrom);
    this.dateToMinDate =
      dateFrom && dateFrom > this.dateFromMinDate ? dateFrom : this.dateFromMinDate;
  }

  private syncDateValidation(): void {
    const dateFrom = this.normalizeDate(this.form.getRawValue().dateFrom);
    const dateTo = this.normalizeDate(this.form.getRawValue().dateTo);

    this.setControlError(
      this.dateFromControl,
      ValidationErrorKeyEnum.PAST_DATE,
      !this.model.isDateToOnlyEditable && !!dateFrom && dateFrom < this.dateFromMinDate
    );
    this.setControlError(
      this.dateToControl,
      ValidationErrorKeyEnum.PAST_DATE,
      !!dateTo && dateTo < this.dateFromMinDate
    );
    this.setControlError(
      this.dateToControl,
      ValidationErrorKeyEnum.START_AFTER_END,
      !!dateFrom && !!dateTo && dateTo < dateFrom
    );
  }

  private setControlError(
    control: FormControl,
    errorKey: ValidationErrorKeyEnum,
    hasError: boolean
  ): void {
    const errors = { ...(control.errors ?? {}) };

    if (hasError) {
      control.setErrors({
        ...errors,
        [errorKey]: true,
      });
      return;
    }

    delete errors[errorKey];
    control.setErrors(Object.keys(errors).length ? errors : null);
  }

  private normalizeDate(value: Date | string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
}
