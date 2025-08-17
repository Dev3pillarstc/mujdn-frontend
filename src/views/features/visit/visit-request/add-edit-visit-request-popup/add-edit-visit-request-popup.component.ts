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
import { TextareaModule } from 'primeng/textarea';
import { DialogRef } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Visit } from '@/models/features/visit/visit';
import { Observable } from 'rxjs';
import { AlertService } from '@/services/shared/alert.service';
import { VisitService } from '@/services/features/visit/visit.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { ValidationMessagesComponent } from '@/views/shared/validation-messages/validation-messages.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

@Component({
  selector: 'app-add-edit-visit-request-popup',
  imports: [
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    InputTextModule,
    TabsModule,
    TableModule,
    Select,
    PaginatorModule,
    CommonModule,
    RequiredMarkerDirective,
    TranslatePipe,
    ValidationMessagesComponent,
  ],
  templateUrl: './add-edit-visit-request-popup.component.html',
  styleUrl: './add-edit-visit-request-popup.component.scss',
})
export class AddEditVisitRequestPopupComponent extends BasePopupComponent<Visit> implements OnInit {
  declare model: Visit;
  declare form: FormGroup;
  declare viewMode: ViewModeEnum;
  alertService = inject(AlertService);
  service = inject(VisitService);
  fb = inject(FormBuilder);
  isCreateMode = false;

  // Lookup data
  nationalities: BaseLookupModel[] = [];
  departments: BaseLookupModel[] = [];

  // For employee selection table
  employees!: any[];
  first: number = 0;
  rows: number = 10;
  selectedEmployees: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  get langOptionLabel(): string {
    const lang = this.languageService.getCurrentLanguage();
    return lang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  // Form control getters
  get nationalIdControl() {
    return this.form.get('nationalId') as FormControl;
  }

  get nationalIdExpiryDateControl() {
    return this.form.get('nationalIdExpiryDate') as FormControl;
  }

  get fullNameControl() {
    return this.form.get('fullName') as FormControl;
  }

  get nationalityControl() {
    return this.form.get('fkNationalityId') as FormControl;
  }

  get visitorOrganizationControl() {
    return this.form.get('visitorOrganization') as FormControl;
  }

  get targetDepartmentControl() {
    return this.form.get('fkTargetDepartmentId') as FormControl;
  }

  get phoneNumberControl() {
    return this.form.get('phoneNumber') as FormControl;
  }

  get addressControl() {
    return this.form.get('address') as FormControl;
  }

  get emailControl() {
    return this.form.get('email') as FormControl;
  }

  get visitDateControl() {
    return this.form.get('visitDate') as FormControl;
  }

  get visitTimeFromControl() {
    return this.form.get('visitTimeFrom') as FormControl;
  }

  get visitTimeToControl() {
    return this.form.get('visitTimeTo') as FormControl;
  }

  get visitPurposeControl() {
    return this.form.get('visitPurpose') as FormControl;
  }

  override initPopup() {
    this.model = this.data.model;
    this.nationalities = this.data.lookups.nationalities || [];
    this.departments = this.data.lookups.departments || [];
    this.viewMode = this.data.viewMode;
    this.isCreateMode = this.viewMode == ViewModeEnum.CREATE;

    // Initialize employee data for selection table
    this.initializeEmployeeData();
  }

  override prepareModel(model: Visit, form: FormGroup): Visit | Observable<Visit> {
    const formValue = form.value;
    this.model = Object.assign(model, { ...formValue });
    return this.model;
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  override saveFail(error: Error): void {
    // Handle save error - could show error message
    console.error('Save failed:', error);
  }

  override afterSave(model: Visit) {
    const successObject = {
      messages: [this.isCreateMode ? 'COMMON.ADDED_SUCCESSFULLY' : 'COMMON.SAVED_SUCCESSFULLY'],
    };
    this.alertService.showSuccessMessage(successObject);
  }

  override beforeSave(model: Visit, form: FormGroup): Observable<boolean> | boolean {
    return form.valid;
  }

  // Initialize employee data for the selection table
  private initializeEmployeeData() {
    // This would typically come from a service call or be passed as lookup data
    this.employees = [
      {
        employeeId: 1234,
        employeeNameAr: 'محمد أحمد طه',
        employeeNameEn: 'Mohamed Ahmed Taha',
        administration: 'إدارة الموارد البشرية',
      },
      {
        employeeId: 1235,
        employeeNameAr: 'أحمد محمد علي',
        employeeNameEn: 'Ahmed Mohamed Ali',
        administration: 'إدارة تقنية المعلومات',
      },
      {
        employeeId: 1236,
        employeeNameAr: 'فاطمة محمد أحمد',
        employeeNameEn: 'Fatma Mohamed Ahmed',
        administration: 'إدارة المالية',
      },
    ];
  }

  // Handle pagination change for employee table
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  // Handle employee selection
  onEmployeeSelect(employee: any) {
    // Logic for handling employee selection
    console.log('Selected employee:', employee);
  }
}
