import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { BlacklistedNationalIdService } from '@/services/features/visit/blacklisted-national-id.service';
import { AlertService } from '@/services/shared/alert.service';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { BlacklistedNationalId } from '@/models/features/visit/blacklisted-national-id';
import { TranslatePipe } from '@ngx-translate/core';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';

@Component({
  selector: 'app-blacklisted-national-ids-popup',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
    TranslatePipe,
    ValidationMessagesComponent,
  ],
  templateUrl: './blacklisted-national-ids-popup.component.html',
  styleUrl: './blacklisted-national-ids-popup.component.scss',
})
export class BlacklistedNationalIdsPopupComponent
  extends BasePopupComponent<BlacklistedNationalId>
  implements OnInit
{
  declare model: BlacklistedNationalId;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(BlacklistedNationalIdService);
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
    model: BlacklistedNationalId,
    form: FormGroup
  ): BlacklistedNationalId | Observable<BlacklistedNationalId> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  override initPopup() {
    this.model = this.data.model;
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode === ViewModeEnum.CREATE;
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  beforeSave(model: BlacklistedNationalId, form: FormGroup) {
    // manipulation before save
    return form.valid;
  }

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  get nationalIdControl() {
    return this.form.get('nationalId') as FormControl;
  }
}
