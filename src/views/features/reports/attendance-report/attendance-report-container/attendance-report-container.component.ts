import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TabsModule } from 'primeng/tabs';
import { MyAttendanceReportListComponent } from '../my-attendance-report-list/my-attendance-report-list.component';
import { AllAttendanceReportListComponent } from '../all-attendance-report-list/all-attendance-report-list.component';
import { MenuItem } from '@/models/shared/menu-item';

@Component({
  selector: 'app-attendance-report-container',
  imports: [
    Breadcrumb,
    RouterModule,
    TabsModule,
    MyAttendanceReportListComponent,
    AllAttendanceReportListComponent,
  ],
  templateUrl: './attendance-report-container.component.html',
  styleUrl: './attendance-report-container.component.scss',
})
export default class AttendanceReportContainerComponent {
  date2: Date | undefined;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'تقرير الحضور و الانصراف' }];
  }
}
