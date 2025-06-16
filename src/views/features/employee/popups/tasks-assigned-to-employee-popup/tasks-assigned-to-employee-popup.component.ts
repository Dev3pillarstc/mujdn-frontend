import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-tasks-assigned-to-employee-popup',
  imports: [PaginatorModule, TableModule],
  templateUrl: './tasks-assigned-to-employee-popup.component.html',
  styleUrl: './tasks-assigned-to-employee-popup.component.scss',
})
export class TasksAssignedToEmployeePopupComponent extends BasePopupComponent {
  first: number = 0;
  rows: number = 10;
  tasks!: any[];

  ngOnInit() {
    this.tasks = [
      {
        taskId: 1,
        taskName: 'حراسة بوابات',
        startDate: '05/06/2024',
        endDate: '24/12/2024',
        assignedTo: 'محمود طه علي',
      },
      {
        taskId: 2,
        taskName: 'مهمة خارجية مطلوبة',
        startDate: '05/06/2024',
        endDate: '24/12/2024',
        assignedTo: 'أحمد هذلر عبدالعزيز',
      },
      {
        taskId: 3,
        taskName: 'حراسة بوابات',
        startDate: '05/06/2024',
        endDate: '24/12/2024',
        assignedTo: 'محمود طه علي',
      },
      {
        taskId: 4,
        taskName: 'مهمة خارجية مطلوبة',
        startDate: '05/06/2024',
        endDate: '24/12/2024',
        assignedTo: 'أحمد هذلر عبدالعزيز',
      },
    ];
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
