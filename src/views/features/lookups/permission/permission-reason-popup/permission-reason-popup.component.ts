import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { PermissionReason } from '@/models/features/lookups/permission/permission-reason';
import { PermissionReasonService } from '@/services/features/lookups/permission-reason.service';
import { AlertService } from '@/services/shared/alert.service';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { ButtonLabel } from 'primeng/button';

@Component({
  selector: 'app-permission-popup',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
    TranslatePipe,
    ValidationMessagesComponent,
  ],
  templateUrl: './permission-reason-popup.component.html',
  styleUrl: './permission-reason-popup.component.scss',
})
export class PermissionReasonPopupComponent
  extends BasePopupComponent<PermissionReason>
  implements OnInit
{
  declare model: PermissionReason;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(PermissionReasonService);
  fb = inject(FormBuilder);
  isCreateMode = false;
  declare viewMode: ViewModeEnum;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override saveFail(error: Error): void {
    // logic after error if there
  }

  override prepareModel(
    model: PermissionReason,
    form: FormGroup
  ): PermissionReason | Observable<PermissionReason> {
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

  beforeSave(model: PermissionReason, form: FormGroup) {
    // manipulation before save
    return form.valid;
  }

  afterSave() {
    const successObject = {
      messages: this.isCreateMode
        ? ['PERMISSION_REASONS_PAGE.PERMISSION_REASON_ADDED_SUCCESSFULLY']
        : ['PERMISSION_REASONS_PAGE.PERMISSION_REASON_UPDATED_SUCCESSFULLY'],
      buttonLabel: 'PERMISSION_REASONS_PAGE.BACK_TO_PERMISSION_REASONS',
    };

    this.alertService.showSuccessMessage(successObject);
  }

  get nameArControl() {
    return this.form.get('nameAr') as FormControl;
  }

  get nameEnControl() {
    return this.form.get('nameEn') as FormControl;
  }
}
