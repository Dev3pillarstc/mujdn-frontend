import { AlertDialogComponent } from '@/abstracts/base-components/alert-dialog/alert-dialog.component';
import { AlertDialogData } from '@/models/shared/alert-dialog-data';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  matDialog = inject(MatDialog);

  showSuccessMessage(
    params: { icon?: string; messages?: string[]; okText?: string },
    dialogSize?: {
      width: string;
      maxWidth: string;
    }
  ) {
    this.matDialog.open(AlertDialogComponent, {
      width: dialogSize?.width || '100%',
      maxWidth: dialogSize?.maxWidth || '600px',
      data: <AlertDialogData>{
        icon: params.icon || 'success',
        messages: params.messages || ['COMMON.SAVED_SUCCESSFULLY'],
        okText: params.okText || 'COMMON.OK',
      },
    });
  }

  showErrorMessage(params: { icon?: string; messages?: string[]; okText?: string }) {
    this.matDialog.open(AlertDialogComponent, {
      width: '350px',
      data: <AlertDialogData>{
        icon: params.icon || 'error',
        messages: params.messages || ['COMMON.ERROR_OCCURRED'],
        okText: params.okText || 'COMMON.OK',
      },
    });
  }
}
