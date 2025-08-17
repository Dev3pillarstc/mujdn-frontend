import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DialogRef } from '@angular/cdk/dialog';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { AlertService } from '@/services/shared/alert.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { TranslatePipe } from '@ngx-translate/core';
import { RequiredMarkerDirective } from '../../../../directives/required-marker.directive';
import { InputNumberModule } from 'primeng/inputnumber';
import { ViewModeEnum } from '@/enums/view-mode-enum';

@Component({
  selector: 'app-presence-inquiries-popup',
  imports: [
    FormsModule,
    DatePickerModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    TranslatePipe,
    ValidationMessagesComponent,
    RequiredMarkerDirective,
    InputNumberModule,
  ],
  templateUrl: './presence-inquiries-popup.component.html',
  styleUrl: './presence-inquiries-popup.component.scss',
})
export class PresenceInquiriesPopupComponent
  extends BasePopupComponent<PresenceInquiry>
  implements OnInit
{
  declare model: PresenceInquiry;
  declare form: FormGroup;
  isCreateMode = false;
  declare viewMode: ViewModeEnum;
  alertService = inject(AlertService);
  fb = inject(FormBuilder);
  data = inject(MAT_DIALOG_DATA);

  override initPopup() {
    this.model = this.data.model ?? new PresenceInquiry();
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode === ViewModeEnum.CREATE;
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  override prepareModel(
    model: PresenceInquiry,
    form: FormGroup
  ): PresenceInquiry | Observable<PresenceInquiry> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  override saveFail(error: Error): void {
    // optional error handling
  }

  beforeSave(model: PresenceInquiry, form: FormGroup) {
    return form.valid;
  }

  afterSave() {
    this.alertService.showSuccessMessage({ messages: ['COMMON.SAVED_SUCCESSFULLY'] });
  }

  get bufferControl() {
    return this.form.get('buffer') as FormControl;
  }

  get messageArControl() {
    return this.form.get('messageAr') as FormControl;
  }

  get messageEnControl() {
    return this.form.get('messageEn') as FormControl;
  }
}
