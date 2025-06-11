import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';

interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-attendance-log-popup',
  imports: [Select, DatePickerModule, FormsModule],
  templateUrl: './attendance-log-popup.component.html',
  styleUrl: './attendance-log-popup.component.scss',
})
export class AttendanceLogPopupComponent extends BasePopupComponent {
  adminstrations: Adminstration[] | undefined;

  date2: Date | undefined;

  selectedAdminstration: Adminstration | undefined;

  ngOnInit() {
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
  }
}
