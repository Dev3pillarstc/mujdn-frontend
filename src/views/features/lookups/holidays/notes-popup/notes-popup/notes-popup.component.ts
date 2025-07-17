import { Holiday } from '@/models/features/lookups/holiday/holiday';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notes-popup',
  imports: [],
  templateUrl: './notes-popup.component.html',
  styleUrl: './notes-popup.component.scss',
})
export class NotesPopupComponent implements OnInit {
  declare notes: string;
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);

  ngOnInit() {
    this.notes = this.data.notes;
  }
  close() {
    this.dialogRef.close();
  }
}
