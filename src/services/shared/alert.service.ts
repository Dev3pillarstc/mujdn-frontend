import { AlertDialogComponent } from '@/abstracts/base-components/alert-dialog/alert-dialog.component';
import { AlertDialogData } from '@/models/shared/alert-dialog-data';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  matDialog = inject(MatDialog);

  showSuccessMessage(params: { icon?: string; messages?: string[]; buttonLabel?: string }) {
    this.matDialog.open(AlertDialogComponent, {
      width: '350px',
      data: <AlertDialogData>{
        icon: params.icon || 'success',
        messages: params.messages || ['COMMON.SAVED_SUCCESSFULLY'],
        buttonLabel: params.buttonLabel || 'COMMON.OK',
      },
    });
  }

  showErrorMessage(params: { icon?: string; messages?: string[]; buttonLabel?: string }) {
    this.matDialog.open(AlertDialogComponent, {
      width: '350px',
      data: <AlertDialogData>{
        icon: params.icon || 'error',
        messages: params.messages || ['COMMON.ERROR_OCCURRED'],
        buttonLabel: params.buttonLabel || 'COMMON.OK',
      },
    });
  }
}
