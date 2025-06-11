import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { ConfirmationDialogData } from '@/models/shared/confirmation-dialog-data';
import { LanguageService } from '@/services/shared/language.service';
import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogContent
    , MatDialogActions
    , TranslatePipe],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    this.direction = this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? LAYOUT_DIRECTION_ENUM.LTR : LAYOUT_DIRECTION_ENUM.RTL;
  }

  onConfirm(): void {
    this.dialogRef.close(DIALOG_ENUM.OK);
  }

  onCancel(): void {
    this.dialogRef.close(DIALOG_ENUM.CANCEL);
  }
}
