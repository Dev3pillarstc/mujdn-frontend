import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-permissions-data-popup',
  imports: [],
  templateUrl: './permissions-data-popup.component.html',
  styleUrl: './permissions-data-popup.component.scss',
})
export class PermissionsDataPopupComponent {
  dialogRef = inject(DialogRef);

  close() {
    this.dialogRef.close();
  }
}
