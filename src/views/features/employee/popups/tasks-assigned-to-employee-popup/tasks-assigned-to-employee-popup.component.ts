import { Component, inject, OnInit } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

@Component({
  selector: 'app-tasks-assigned-to-employee-popup',
  imports: [PaginatorModule, TableModule],
  templateUrl: './tasks-assigned-to-employee-popup.component.html',
  styleUrl: './tasks-assigned-to-employee-popup.component.scss',
})
export class TasksAssignedToEmployeePopupComponent implements OnInit {
  first: number = 0;
  rows: number = 10;
  tasks!: any[];
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);

  ngOnInit() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
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

  close() {
    this.dialogRef.close();
  }
}
