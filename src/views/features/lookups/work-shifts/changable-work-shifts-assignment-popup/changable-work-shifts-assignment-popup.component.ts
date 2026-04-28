import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@/services/shared/language.service';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-changable-work-shifts-assignment-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    MultiSelectModule,
    ButtonModule,
    AccordionModule,
    TranslatePipe,
  ],
  templateUrl: './changable-work-shifts-assignment-popup.component.html',
  styleUrl: './changable-work-shifts-assignment-popup.component.scss',
})
export class ChangableWorkShiftsAssignmentPopupComponent extends BasePopupComponent<any> implements OnInit {
  declare model: any;
  declare form: FormGroup;
  fb = inject(FormBuilder);
  override dialogRef = inject(MatDialogRef<ChangableWorkShiftsAssignmentPopupComponent>);

  departments = [
    { label: 'الادارة العامة', id: 1 },
    { label: 'ادارة الموارد البشرية', id: 2 },
  ];

  employees = [
    { label: 'محمد أحمد', id: 1 },
    { label: 'علي حسن', id: 2 },
    { label: 'إبراهيم محمود', id: 3 },
  ];

  shifts = [
    { label: 'الوردية الأولى', id: 1 },
    { label: 'الوردية الثانية', id: 2 },
    { label: 'الوردية الثالثة', id: 3 },
  ];

  activeShift = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override initPopup(): void {
    this.model = this.data.model || { assignmentId: 'Shift-01' };
  }

  override buildForm(): void {
    this.form = this.fb.group({
      assignmentId: [this.model.assignmentId],
      startDate: [this.model.startDate ? new Date(this.model.startDate) : null],
      endDate: [this.model.endDate ? new Date(this.model.endDate) : null],
      shift1: [null],
      shift2: [null],
      shift3: [null],
      fkDepartmentId: [null],
      userIdsArray: [[]],
    });
  }

  override saveFail(error: Error): void {
    console.error('Save failed:', error);
  }

  override afterSave(model: any, dialogRef: MatDialogRef<any>): void {
    console.log('Saved successfully:', model);
  }

  override beforeSave(model: any, form: FormGroup): Observable<boolean> | boolean {
    return form.valid;
  }

  override prepareModel(model: any, form: FormGroup): Observable<any> | any {
    return { ...model, ...form.value };
  }

  onSave() {
    this.save$.next();
  }

  onCancel() {
    this.close();
  }
}
