import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { PermissionReason } from '@/models/features/lookups/permission-reason/permission-reason';
import { PermissionReasonService } from '@/services/features/lookups/permission-reason.service';
import { AlertService } from '@/services/shared/alert.service';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';

@Component({
  selector: 'app-permission-popup',
  imports: [InputTextModule, ReactiveFormsModule, RequiredMarkerDirective],
  templateUrl: './permission-reason-popup.component.html',
  styleUrl: './permission-reason-popup.component.scss',
})
export class PermissionReasonPopupComponent extends BasePopupComponent<PermissionReason> implements OnInit {
  declare model: PermissionReason;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(PermissionReasonService);
  fb = inject(FormBuilder);

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
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  beforeSave(model: PermissionReason, form: FormGroup) {
    // manipulation before save
    return form.valid;
  }

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }
}
