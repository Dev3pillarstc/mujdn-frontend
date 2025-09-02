import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { UserProfile } from '@/models/features/user-profile/user-profile';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { M } from '@angular/material/dialog.d-B5HZULyo';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { AlertService } from '@/services/shared/alert.service';
import { UserProfileService } from '@/services/features/user-profile.service';
import { TranslatePipe } from '@ngx-translate/core';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';

@Component({
  selector: 'app-edit-info-popup',
  imports: [
    CommonModule,
    InputTextModule,
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
    ValidationMessagesComponent,
  ],
  templateUrl: './edit-info-popup.component.html',
  styleUrl: './edit-info-popup.component.scss',
})
export class EditInfoPopupComponent extends BasePopupComponent<UserProfile> implements OnInit {
  declare model: UserProfile;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(UserProfileService);
  fb = inject(FormBuilder);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }
  override initPopup(): void {
    this.model = this.data;
  }
  override buildForm(): void {
    this.form = this.fb.group(this.model.buildForm());
  }
  override saveFail(error: Error): void {
    // logic after error if there
  }
  override beforeSave(model: UserProfile, form: FormGroup): Observable<boolean> | boolean {
    // manipulation before save
    return form.valid;
  }
  override afterSave(model: UserProfile, dialogRef: M<any, any>): void {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }
  override prepareModel(
    model: UserProfile,
    form: FormGroup
  ): UserProfile | Observable<UserProfile> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  get emailControl() {
    return this.form.get('email') as FormControl;
  }
  get phoneNumberControl() {
    return this.form.get('phoneNumber') as FormControl;
  }
}
