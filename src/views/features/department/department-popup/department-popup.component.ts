import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { CommonModule } from '@angular/common';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-department-popup',
  imports: [Select, DatePickerModule, FormsModule, InputTextModule, CommonModule],
  templateUrl: './department-popup.component.html',
  styleUrl: './department-popup.component.scss',
})
export class DepartmentPopupComponent {
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;
  dialogRef = inject(DialogRef);
  levelType: string = 'one-level';

  ngOnInit() {
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
  }

  close() {
    this.dialogRef.close();
  }
}
