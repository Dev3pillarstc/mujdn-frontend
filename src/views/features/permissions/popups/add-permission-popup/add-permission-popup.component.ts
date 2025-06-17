import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-add-permission-popup',
  imports: [Select, DatePickerModule, FormsModule, TextareaModule],
  templateUrl: './add-permission-popup.component.html',
  styleUrl: './add-permission-popup.component.scss',
})
export class AddPermissionPopupComponent {
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;
  dialogRef = inject(DialogRef);

  ngOnInit() {
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
  }

  close() {
    this.dialogRef.close();
  }
}
