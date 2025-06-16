import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-add-task-popup',
  imports: [Select, DatePickerModule, FormsModule, TextareaModule],
  templateUrl: './add-task-popup.component.html',
  styleUrl: './add-task-popup.component.scss',
})
export class AddTaskPopupComponent extends BasePopupComponent implements OnInit {
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;

  ngOnInit() {
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
  }
}
