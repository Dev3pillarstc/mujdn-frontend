import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AttendanceLog } from '@/models/features/attendance/attendance-log/attendance-log';
import { DialogRef } from '@angular/cdk/dialog';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';

@Component({
  selector: 'app-attendance-report-popup',
  imports: [PaginatorModule, TableModule, CommonModule, DatePickerModule, FormsModule],
  templateUrl: './attendance-report-popup.component.html',
  styleUrl: './attendance-report-popup.component.scss',
})
export class AttendanceReportPopupComponent implements OnInit {
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;
  dialogRef = inject(DialogRef);
  declare direction: LAYOUT_DIRECTION_ENUM;

  attendance!: any[];
  declare form: FormGroup;
  declare model: AttendanceLog;
  languageService = inject(LanguageService);

  ngOnInit() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  close() {
    this.dialogRef.close();
  }
}
