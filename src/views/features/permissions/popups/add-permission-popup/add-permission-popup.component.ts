import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Permission } from '@/models/features/lookups/permission/permission';
import { PermissionService } from '@/services/features/lookups/permission.service';
import { AlertService } from '@/services/shared/alert.service';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Observable } from 'rxjs';

interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-add-permission-popup',
  imports: [
    Select,
    DatePickerModule,
    FormsModule,
    TextareaModule,
    TranslatePipe,
    ReactiveFormsModule,
    ValidationMessagesComponent,
  ],
  templateUrl: './add-permission-popup.component.html',
  styleUrl: './add-permission-popup.component.scss',
})
export class AddPermissionPopupComponent extends BasePopupComponent<Permission> implements OnInit {
  declare model: Permission;
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(PermissionService);
  fb = inject(FormBuilder);
  permissionTypes: BaseLookupModel[] | undefined = [];
  prmissionReasons: BaseLookupModel[] | undefined = [];
  minDate: Date | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override saveFail(error: Error): void {
    // logic after error if there
  }

  override prepareModel(model: Permission, form: FormGroup): Permission | Observable<Permission> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  override initPopup() {
    this.model = this.data.model;
    this.prmissionReasons = this.data.lookups.prmissionReasons;
    this.permissionTypes = this.data.lookups.permissionTypes;
  }

  override buildForm() {
    this.minDate = this.data.viewMode == ViewModeEnum.EDIT ? null : new Date();

    this.form = this.fb.group(this.model.buildForm());
  }

  beforeSave(model: Permission, form: FormGroup) {
    // manipulation before save
    return form.valid;
  }

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  getPropertyName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }
  get fkPermissionTypeIdControl() {
    return this.form.get('fkPermissionTypeId') as FormControl;
  }
  get permissionDateControl() {
    return this.form.get('permissionDate') as FormControl;
  }
  get fkReasonIdControl() {
    return this.form.get('fkReasonId') as FormControl;
  }
  get descriptionControl() {
    return this.form.get('description') as FormControl;
  }
}
