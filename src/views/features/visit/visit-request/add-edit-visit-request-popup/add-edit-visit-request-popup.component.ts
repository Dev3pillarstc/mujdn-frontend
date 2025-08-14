import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { DialogRef } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-add-edit-visit-request-popup',
  imports: [
    DatePickerModule,
    FormsModule,
    TextareaModule,
    InputTextModule,
    TabsModule,
    TableModule,
    Select,
    PaginatorModule,
  ],
  templateUrl: './add-edit-visit-request-popup.component.html',
  styleUrl: './add-edit-visit-request-popup.component.scss',
})
export class AddEditVisitRequestPopupComponent {
  date2: Date | undefined;
  dialogRef = inject(DialogRef);
  employees!: any[];
  first: number = 0;
  rows: number = 10;

  ngOnInit() {
    // Updated dummy data to match your Arabic table structure
    this.employees = [
      {
        employeeId: 1234,
        employeeNameAr: 'محمد أحمد طه',
        employeeNameEn: 'mohamed taha',
        adminstration: 'إدارة الموارد',
      },
    ];
  }
  close() {
    this.dialogRef.close();
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
