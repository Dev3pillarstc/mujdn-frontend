import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { AlertService } from '@/services/shared/alert.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AccessLocation } from '@/models/features/business/access-location';
import { TranslatePipe } from '@ngx-translate/core';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { RequiredMarkerDirective } from '../../../../directives/required-marker.directive';

@Component({
  selector: 'app-devices-location-modal',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
    TranslatePipe,
    ValidationMessagesComponent,
  ],
  templateUrl: './devices-location-modal.component.html',
  styleUrl: './devices-location-modal.component.scss',
})
export class DevicesLocationModalComponent
  extends BasePopupComponent<AccessLocation>
  implements OnInit
{
  declare model: AccessLocation;
  declare form: FormGroup;
  isCreateMode = false;
  declare viewMode: ViewModeEnum;
  alertService = inject(AlertService);
  fb = inject(FormBuilder);
  data = inject(MAT_DIALOG_DATA);

  override initPopup() {
    this.model = this.data.model;
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode === ViewModeEnum.CREATE;
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  override prepareModel(
    model: AccessLocation,
    form: FormGroup
  ): AccessLocation | Observable<AccessLocation> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  override saveFail(error: Error): void {
    // optional error handling
  }

  beforeSave(model: AccessLocation, form: FormGroup) {
    return form.valid;
  }

  afterSave() {
    this.alertService.showSuccessMessage({ messages: ['COMMON.SAVED_SUCCESSFULLY'] });
  }

  get nameArControl() {
    return this.form.get('nameAr') as FormControl;
  }

  get nameEnControl() {
    return this.form.get('nameEn') as FormControl;
  }
}
