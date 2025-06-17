import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DialogRef } from '@angular/cdk/dialog';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-attendance-popup',
  imports: [Select, DatePickerModule, FormsModule],
  templateUrl: './attendance-log-popup.component.html',
  styleUrl: './attendance-log-popup.component.scss',
})
export class AttendanceLogPopupComponent implements OnInit {
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);
  adminstrations: Adminstration[] | undefined;

  date2: Date | undefined;

  selectedAdminstration: Adminstration | undefined;

  ngOnInit() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
  }

  close() {
    this.dialogRef.close();
  }
}
