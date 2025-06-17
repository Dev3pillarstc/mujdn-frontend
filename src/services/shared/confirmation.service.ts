import { ConfirmationDialogComponent } from '@/abstracts/base-components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@/models/shared/confirmation-dialog-data';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  matDialog = inject(MatDialog);

  open(
    params: { icon?: string; messages?: string[]; confirmText?: string; cancelText?: string },
    dialogSize?: {
      width: string;
      maxWidth: string;
    }
  ) {
    return this.matDialog.open(ConfirmationDialogComponent, {
      width: dialogSize?.width || '100%',
      maxWidth: dialogSize?.maxWidth || '600px',
      data: <ConfirmationDialogData>{
        icon: params.icon || 'warning',
        messages: params.messages || ['COMMON.CONFIRM_DELETE'],
        confirmText: params.confirmText || 'COMMON.OK',
        cancelText: params.cancelText || 'COMMON.CANCEL',
      },
    });
  }
}
