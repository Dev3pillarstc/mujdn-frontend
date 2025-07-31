import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-edit-info-popup',
  imports: [CommonModule, InputTextModule],
  templateUrl: './edit-info-popup.component.html',
  styleUrl: './edit-info-popup.component.scss',
})
export class EditInfoPopupComponent {
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);
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
