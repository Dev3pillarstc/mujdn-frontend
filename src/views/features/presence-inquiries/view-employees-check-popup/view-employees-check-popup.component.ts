import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-view-employees-check-popup',
  imports: [],
  templateUrl: './view-employees-check-popup.component.html',
  styleUrl: './view-employees-check-popup.component.scss',
})
export class ViewEmployeesCheckPopupComponent {
  dialogRef = inject(DialogRef);

  close() {
    this.dialogRef.close();
  }
}
