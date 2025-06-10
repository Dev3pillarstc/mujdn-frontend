import {Component, inject} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-base-popup',
  imports: [],
  templateUrl: './base-popup.component.html',
  styleUrl: './base-popup.component.scss'
})
export class BasePopupComponent {
  dialogRef = inject(MatDialogRef);
  close() {
    this.dialogRef.close();
  }
}
