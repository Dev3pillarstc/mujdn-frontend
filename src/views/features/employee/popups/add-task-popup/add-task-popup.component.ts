import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-add-task-popup',
  imports: [Select, DatePickerModule, FormsModule, TextareaModule],
  templateUrl: './add-task-popup.component.html',
  styleUrl: './add-task-popup.component.scss',
})
export class AddTaskPopupComponent implements OnInit {
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);

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
