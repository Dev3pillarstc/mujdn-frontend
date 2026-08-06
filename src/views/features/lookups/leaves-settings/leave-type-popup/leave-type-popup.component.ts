import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeaveType } from '@/models/features/lookups/LeaveType';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { Observable } from 'rxjs';
import { AlertService } from '@/services/shared/alert.service';
import { LeaveTypeService } from '@/services/features/lookups/leave-type.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';

@Component({
  selector: 'app-leave-type-popup',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
    TranslatePipe,
    ValidationMessagesComponent,
  ],
  templateUrl: './leave-type-popup.component.html',
  styleUrl: './leave-type-popup.component.scss',
})
export class LeaveTypePopupComponent extends BasePopupComponent<LeaveType> implements OnInit {
  declare model: LeaveType;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(LeaveTypeService);
  fb = inject(FormBuilder);
  isCreateMode = false;
  declare viewMode: ViewModeEnum;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  get nameArControl() {
    return this.form.get('nameAr') as FormControl;
  }

  get nameEnControl() {
    return this.form.get('nameEn') as FormControl;
  }

  override saveFail(error: Error): void {
    // logic after error if there
  }

  override prepareModel(model: LeaveType, form: FormGroup): LeaveType | Observable<LeaveType> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  override initPopup() {
    this.model = this.data.model;
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode == ViewModeEnum.CREATE;
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  beforeSave(model: LeaveType, form: FormGroup) {
    return form.valid;
  }

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }
}
