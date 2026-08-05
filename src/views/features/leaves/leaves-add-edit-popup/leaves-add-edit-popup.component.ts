import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-leaves-add-edit-popup',
  imports: [CommonModule, FormsModule, SelectModule, DatePickerModule],
  templateUrl: './leaves-add-edit-popup.component.html',
  styleUrl: './leaves-add-edit-popup.component.scss',
})
export class LeavesAddEditPopupComponent {
  private dialogRef = inject(MatDialogRef<LeavesAddEditPopupComponent>);

  model: any;

  employees = [{ name: 'احمد محمد عبد المقصود' }, { name: 'عبدالعزيز محمد' }];

  departments = [{ name: 'ادارة خارجية' }, { name: 'ادارة داخلية' }];

  leaveTypes = [{ name: 'اجازة مرضية' }, { name: 'اجازة سنوية' }, { name: 'اجازة اضطرارية' }];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.model = data?.model;
  }

  close() {
    this.dialogRef.close();
  }
}
