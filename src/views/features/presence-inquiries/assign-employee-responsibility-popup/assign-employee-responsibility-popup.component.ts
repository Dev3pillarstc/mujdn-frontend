import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DialogRef } from '@angular/cdk/dialog';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-assign-employee-responsibility-popup',
  imports: [
    FormsModule,
    Select,
    DatePickerModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    TableModule,
    PaginatorModule,
  ],
  templateUrl: './assign-employee-responsibility-popup.component.html',
  styleUrl: './assign-employee-responsibility-popup.component.scss',
})
export class AssignEmployeeResponsibilityPopupComponent {
  attendance!: any[];
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;
  yourFormGroup = new FormGroup({
    fromDate: new FormControl(null), // التاريخ (من)
    timeTo: new FormControl(null), // وقت المساءلة
    allowedDuration: new FormControl(null), // فترة السماح
    employee: new FormControl(null), // اسم الموظف
  });

  selectedAdminstration: Adminstration | undefined;
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);
  adminstrations: Adminstration[] | undefined;

  ngOnInit() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;

    this.attendance = [
      {
        serialNumber: 1,
        employeeNameAr: 'محمد أحمد طه',
        employeeNameEn: 'mohamed taha',
        adminstration: 'إدارة الموارد',
        jop: 'موظف',
        PermanentType: 'دوام كلي',
        date: '12/12/2024',
      },
    ];
  }

  close() {
    this.dialogRef.close();
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
