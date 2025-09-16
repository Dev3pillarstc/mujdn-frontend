import { AccordionModule } from 'primeng/accordion';
import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
@Component({
  selector: 'app-reports-processing',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    Select,
    MultiSelect,
    AccordionModule,
  ],
  templateUrl: './reports-processing.component.html',
  styleUrl: './reports-processing.component.scss',
})
export default class ReportsProcessingComponent {
  date2: Date | undefined;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'معالجة بيانات تقارير الموظفين' }];
  }
}
