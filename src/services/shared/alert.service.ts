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
    icon: string = 'success',
    messages: string[] = ['COMMON.SAVED_SUCCESSFULLY'],
    okText: string = 'COMMON.OK'
  ) {
    this.matDialog.open(AlertDialogComponent, {
      width: '350px',
      data: <AlertDialogData>{
        icon: icon,
        messages: messages,
        okText: okText,
      },
    });
  }
  showErrorMessage(
    icon: string = 'error',
    messages: string[] = ['COMMON.ERROR_OCCURRED'],
    okText: string = 'COMMON.OK'
  ) {
    this.matDialog.open(AlertDialogComponent, {
      width: '350px',
      data: <AlertDialogData>{
        icon: icon,
        messages: messages,
        okText: okText,
      },
    });
  }
}
