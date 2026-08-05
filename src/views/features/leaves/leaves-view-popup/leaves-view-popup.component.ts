import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-leaves-view-popup',
  imports: [CommonModule],
  templateUrl: './leaves-view-popup.component.html',
  styleUrl: './leaves-view-popup.component.scss',
})
export class LeavesViewPopupComponent {
  private dialogRef = inject(MatDialogRef<LeavesViewPopupComponent>);

  model: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.model = data?.model;
  }

  close() {
    this.dialogRef.close();
  }
}
