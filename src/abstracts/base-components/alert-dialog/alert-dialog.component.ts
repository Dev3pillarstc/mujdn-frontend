import { AlertDialogData } from '@/models/shared/alert-dialog-data';
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

@Component({
  selector: 'app-alert-dialog',
  imports: [TranslatePipe],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss',
})
export class AlertDialogComponent {
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertDialogData) {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  get iconPath(): string {
    switch (this.data.icon) {
      case 'success':
        return 'assets/icons/success.svg';
      case 'error':
        return 'assets/icons/error.svg';
      case 'info':
        return 'assets/icons/info.svg';
      case 'warning':
        return 'assets/icons/warning.svg';
      default:
        return '';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
