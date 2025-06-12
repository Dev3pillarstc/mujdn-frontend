import { AlertDialogData } from '@/models/shared/alert-dialog-data';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-dialog',
  imports: [TranslatePipe],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss',
})
export class AlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  get iconPath(): string {
    switch (this.data.icon) {
      case 'success':
        return '/assets/icons/checkmark.svg';
      case 'error':
        return '/assets/icons/error.svg';
      case 'info':
        return '/assets/icons/info.svg';
      case 'warning':
        return '/assets/icons/warning.svg';
      default:
        return '';
    }
  }
}
