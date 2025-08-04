import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-change-password-popup',
  imports: [CommonModule, InputTextModule, Password],
  templateUrl: './change-password-popup.component.html',
  styleUrl: './change-password-popup.component.scss',
})
export class ChangePasswordPopupComponent {
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
