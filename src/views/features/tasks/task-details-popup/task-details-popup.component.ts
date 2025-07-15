import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DialogRef } from '@angular/cdk/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-task-details-popup',
  imports: [CommonModule],
  templateUrl: './task-details-popup.component.html',
  styleUrl: './task-details-popup.component.scss',
})
export class TaskDetailsPopupComponent {
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
