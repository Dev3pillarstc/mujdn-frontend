import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-view-mission-data-popup',
  imports: [],
  templateUrl: './view-mission-data-popup.component.html',
  styleUrl: './view-mission-data-popup.component.scss',
})
export class ViewMissionDataPopupComponent {
  dialogRef = inject(DialogRef);

  close() {
    this.dialogRef.close();
  }
}
