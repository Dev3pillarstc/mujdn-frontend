import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-base-popup',
  imports: [],
  templateUrl: './base-popup.component.html',
  styleUrl: './base-popup.component.scss',
})
export class BasePopupComponent {
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(MatDialogRef);

  constructor() {
    this.direction = this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? LAYOUT_DIRECTION_ENUM.LTR : LAYOUT_DIRECTION_ENUM.RTL;
  }

  close() {
    this.dialogRef.close();
  }
}
