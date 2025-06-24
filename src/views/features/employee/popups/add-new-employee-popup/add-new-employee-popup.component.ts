import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { TranslatePipe } from '@ngx-translate/core';
import { ACCOUNT_STATUS_OPTIONS, AccountStatusOption } from '@/models/shared/account-status-option';
import {
  BooleanOptionModel,
  FINGERPRINT_EXEMPTION_OPTIONS,
} from '@/models/shared/fingerprint-exempt-option';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { City } from '@/models/features/lookups/City/city';
import { Region } from '@/models/features/lookups/region/region'; // Import your enums
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { CityLookup } from '@/models/features/lookups/City/city-lookup';

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
    TranslatePipe,
    ValidationMessagesComponent,
  ],
  templateUrl: './add-new-employee-popup.component.html',
  styleUrl: './add-new-employee-popup.component.scss',
})
export class AddNewEmployeePopupComponent extends BasePopupComponent<User> implements OnInit {
  declare model: User;
  declare form: FormGroup;
  declare viewMode: ViewModeEnum;
  isCreateMode = false;

  departments: BaseLookupModel[] = [
    { id: 1, nameEn: 'name 1', nameAr: 'name 1' },
    { id: 2, nameEn: 'name 2', nameAr: 'name 2' },
  ];

  accountStatusOptions: AccountStatusOption[] = ACCOUNT_STATUS_OPTIONS;
  fingerprintExemptionOptions: BooleanOptionModel[] = FINGERPRINT_EXEMPTION_OPTIONS;

  selectedDepartment: BaseLookupModel | undefined;
  selectedAccountStatus: AccountStatusOption | undefined;
  date2: Date | undefined;

  alertService = inject(AlertService);
  service = inject(UserService);
  fb = inject(FormBuilder);
  cities: CityLookup[] = [];
  regions: BaseLookupModel[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override initPopup() {
    this.model = this.data.model;
    this.cities = this.data.lookups.cities;
    this.regions = this.data.lookups.regions;
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode == ViewModeEnum.CREATE;
    console.log('this.cities', this.cities);
    console.log('this.regions', this.regions);
  }

  override prepareModel(model: User, form: FormGroup): User | Observable<User> {
    // Map the boolean values correctly
    const formValue = form.value;

    // Convert account status to boolean for isActive
    if (formValue.accountStatus !== undefined) {
      formValue.isActive = formValue.accountStatus;
    }

    this.model = Object.assign(model, { ...formValue });
    return this.model;
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm(this.viewMode));

    // Set initial values if needed
    if (this.model.isActive !== undefined) {
      this.selectedAccountStatus = this.accountStatusOptions.find(
        (option) => option.id === this.model.isActive
      );
    }
  }

  override saveFail(error: Error): void {}

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  override beforeSave(model: User, form: FormGroup): Observable<boolean> | boolean {
    return form.valid;
  }

  // Helper method to get display text for account status
  getAccountStatusText(isActive: boolean): string {
    const option = this.accountStatusOptions.find((opt) => opt.id === isActive);
    return option ? option.nameAr : '';
  }

  // Helper method to get display text for fingerprint exemption
  getFingerprintExemptionText(canLeave: boolean): string {
    const option = this.fingerprintExemptionOptions.find((opt) => opt.id === canLeave);
    return option ? option.nameAr : '';
  }

  // Add these getters to your component class
  // get departmentControl() {
  //   return this.form.get('fkDepartmentId') as FormControl;
  // }
  // get regionControl() {
  //   return this.form.get('fkRegionId') as FormControl;
  // }
  // get cityControl() {
  //   return this.form.get('fkCityId') as FormControl;
  // }
  // get workTypeControl() {
  //   return this.form.get('workTypeId') as FormControl; // Assuming formControlName is 'workTypeId'
  // }
  get fullNameArControl() {
    return this.form.get('fullNameAr') as FormControl;
  }
  get fullNameEnControl() {
    return this.form.get('fullNameEn') as FormControl;
  }
  get phoneNumberControl() {
    return this.form.get('phoneNumber') as FormControl;
  }
  get jobTitleArControl() {
    return this.form.get('jobTitleAr') as FormControl;
  }
  get jobTitleEnControl() {
    return this.form.get('jobTitleEn') as FormControl;
  }
  get emailControl() {
    return this.form.get('email') as FormControl;
  }
  get joinDateControl() {
    return this.form.get('joinDate') as FormControl;
  }
  get accountStatusControl() {
    return this.form.get('isActive') as FormControl;
  }
  get nationalIdControl() {
    return this.form.get('nationalId') as FormControl;
  }
  get passwordControl() {
    return this.form.get('password') as FormControl;
  }
}
