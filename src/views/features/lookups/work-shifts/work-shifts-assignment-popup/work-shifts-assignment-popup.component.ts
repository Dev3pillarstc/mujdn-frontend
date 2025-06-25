import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DialogRef } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-work-shifts-assignment-popup',
  imports: [DatePickerModule, FormsModule, InputTextModule],
  templateUrl: './work-shifts-assignment-popup.component.html',
  styleUrl: './work-shifts-assignment-popup.component.scss',
})
export class WorkShiftsAssignmentPopupComponent {
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);
  adminstrations: Adminstration[] | undefined;

  date2: Date | undefined;

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
