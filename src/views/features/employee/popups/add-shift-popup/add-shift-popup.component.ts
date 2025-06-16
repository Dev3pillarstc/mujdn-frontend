import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-add-shift-popup',
  imports: [Select, DatePickerModule, FormsModule],
  templateUrl: './add-shift-popup.component.html',
  styleUrl: './add-shift-popup.component.scss',
})
export class AddShiftPopupComponent extends BasePopupComponent implements OnInit {
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;

  ngOnInit() {
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
  }
}
