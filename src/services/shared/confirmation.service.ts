import { ConfirmationDialogComponent } from '@/abstracts/base-components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@/models/shared/confirmation-dialog-data';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  matDialog = inject(MatDialog);

  open(messages?: string[], confirmText?: string, cancelText?: string) {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: <ConfirmationDialogData>{
        messages: messages || ['COMMON.CONFIRM_DELETE'],
        confirmText: confirmText || 'COMMON.OK',
        cancelText: cancelText || 'COMMON.CANCEL',
      },
    });
    return dialogRef;
  }
}
