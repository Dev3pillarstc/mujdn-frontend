import {inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

export abstract class BaseListComponent<T> {
  abstract openDialog(): void;

  dialog = inject(MatDialog);

  openBaseDialog(popupComponent: T) {
    const dialogRef = this.dialog.open(popupComponent as any);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
