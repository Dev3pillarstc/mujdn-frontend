import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-add-new-employee-popup',
  imports: [Select, DatePickerModule, InputTextModule, CommonModule,FormsModule],
  templateUrl: './add-new-employee-popup.component.html',
  styleUrl: './add-new-employee-popup.component.scss',
})
export class AddNewEmployeePopupComponent extends BasePopupComponent implements OnInit {
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;

  ngOnInit() {
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
  }
}
