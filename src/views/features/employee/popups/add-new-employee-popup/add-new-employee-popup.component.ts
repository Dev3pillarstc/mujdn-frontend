import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { User } from '@/models/auth/user';
import { Observable } from 'rxjs';
import { AlertService } from '@/services/shared/alert.service';
import { UserService } from '@/services/features/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';

@Component({
  selector: 'app-add-new-employee-popup',
  imports: [
    Select,
    DatePickerModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RequiredMarkerDirective,
  ],
  templateUrl: './add-new-employee-popup.component.html',
  styleUrl: './add-new-employee-popup.component.scss',
})
export class AddNewEmployeePopupComponent extends BasePopupComponent<User> implements OnInit {
  declare model: User;
  declare form: FormGroup;
  departments: BaseLookupModel[] = [
    { id: 1, nameEn: 'name 1', nameAr: 'name 1' },
    { id: 2, nameEn: 'name 2', nameAr: 'name 2' },
  ];
  selectedDepartment: BaseLookupModel | undefined;
  date2: Date | undefined;
  alertService = inject(AlertService);
  service = inject(UserService);
  fb = inject(FormBuilder);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override initPopup() {
    this.model = this.data.model;
  }
  override prepareModel(model: User, form: FormGroup): User | Observable<User> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  override saveFail(error: Error): void {}

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }
  override beforeSave(model: User, form: FormGroup): Observable<boolean> | boolean {
    return form.valid;
  }
}
