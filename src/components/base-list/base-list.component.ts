import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-base-list',
  imports: [],
  templateUrl: './base-list.component.html',
  styleUrl: './base-list.component.scss',
})
export abstract class BaseListComponent<T> {
  abstract openDialog(): void;
  dialog = inject(MatDialog);
  openBaseDialog(popupComponent: T) {
    const dialogRef = this.dialog.open(popupComponent as any);
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
