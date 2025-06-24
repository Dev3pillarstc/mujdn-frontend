import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { Department } from '@/models/features/lookups/Department/department';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { M } from '@angular/material/dialog.d-B5HZULyo';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from '@/services/shared/alert.service';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-department-popup',
  imports: [Select, DatePickerModule, FormsModule, InputTextModule, CommonModule],
  templateUrl: './department-popup.component.html',
  styleUrl: './department-popup.component.scss',
})
export class DepartmentPopupComponent extends BasePopupComponent<Department> implements OnInit {
  declare model: Department;
  declare form: FormGroup<any>;
  alertService = inject(AlertService);
  fb = inject(FormBuilder);
  override initPopup() {
    this.model = this.data.model;
  }
  override buildForm() {
    // this.form = this.fb.group(this.model.buildForm());
  }
  override saveFail(error: Error): void {
    throw new Error('Method not implemented.');
  }
  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }
  beforeSave(model: Department, form: FormGroup) {
    // manipulation before save
    return form.valid;
  }
  override prepareModel(model: Department, form: FormGroup): Department | Observable<Department> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;
  // dialogRef = inject(DialogRef);
  levelType: string = 'one-level';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }
  // ngOnInit() {
  //   this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
  // }

  // close() {
  //   this.dialogRef.close();
  // }
}
