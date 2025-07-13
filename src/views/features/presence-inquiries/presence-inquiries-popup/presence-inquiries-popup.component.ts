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

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-presence-inquiries-popup',
  imports: [
    FormsModule,
    Select,
    DatePickerModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './presence-inquiries-popup.component.html',
  styleUrl: './presence-inquiries-popup.component.scss',
})
export class PresenceInquiriesPopupComponent {
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
  }

  close() {
    this.dialogRef.close();
  }
}
