import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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


@Component({
  selector: 'app-work-shifts-assignment-popup',
  imports: [
    FormsModule,
    Select,
    DatePickerModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
    TranslatePipe,
    ValidationMessagesComponent
  ],
  templateUrl: './work-shifts-assignment-popup.component.html',
  styleUrl: './work-shifts-assignment-popup.component.scss',
})
export class WorkShiftsAssignmentPopupComponent extends BasePopupComponent<UserWorkShift> implements OnInit {
  model!: UserWorkShift; // Remove declare, use definite assignment assertion
  usersProfiles: UsersWithDepartmentLookup[] = [];
  departments: BaseLookupModel[] = [];
  shifts: Shift[] = [];
  form!: FormGroup; // Remove declare, use definite assignment assertion
  viewMode!: ViewModeEnum;
  fb = inject(FormBuilder);
  alertService = inject(AlertService);
  langService = inject(LanguageService);
  isCreateMode = false;

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
  }

  override buildForm(): void {
    // The model's buildForm method returns the correct form structure
    this.form = this.fb.group(this.model.buildForm());
  }

  override saveFail(error: Error): void {
    console.error('Save failed:', error);
    // Handle save failure - show error message
    this.alertService.showErrorMessage({
      messages: ['COMMON.SAVE_FAILED']
    });
  }

  override afterSave(model: UserWorkShift, dialogRef: MatDialogRef<any, any>): void {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  override beforeSave(model: UserWorkShift, form: FormGroup): Observable<boolean> | boolean {
    return form.valid;
  }

  override prepareModel(model: UserWorkShift, form: FormGroup): UserWorkShift | Observable<UserWorkShift> {
    // Create updated model with form values
    const updatedModel = Object.assign(this.model, { ...form.value });
    return updatedModel;
  }

  // Method to trigger save (called from template)
  save(): void {
    this.save$.next();
  }
  get optionLabel(): string {
    const lang = this.langService.getCurrentLanguage();
    return lang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  filterEmployeesByDepartment(departmentId: number) {
    this.usersProfiles = this.usersProfiles.filter((emp) => emp.departmentId === departmentId);
  }
  date2: Date | undefined;
}