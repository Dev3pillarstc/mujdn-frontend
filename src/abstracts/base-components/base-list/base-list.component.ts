import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

export abstract class BaseListComponent<T> {
  abstract openDialog(): void;
  abstract dialogSize: any;
  dialog = inject(MatDialog);

  openBaseDialog(popupComponent: T) {
    const dialogRef = this.dialog.open(popupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
