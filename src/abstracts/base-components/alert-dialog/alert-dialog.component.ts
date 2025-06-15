import { AlertDialogData } from '@/models/shared/alert-dialog-data';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';

@Component({
  selector: 'app-alert-dialog',
  imports: [TranslatePipe],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss',
})
export class AlertDialogComponent extends BasePopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertDialogData) {
    super();
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

  onClose(): void {
    this.dialogRef.close();
  }
}
