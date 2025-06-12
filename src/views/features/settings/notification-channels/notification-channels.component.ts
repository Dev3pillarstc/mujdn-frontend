import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  selector: 'app-notification-channels',
  imports: [MatDialogModule, Breadcrumb],
  templateUrl: './notification-channels.component.html',
  styleUrl: './notification-channels.component.scss'
})
export default class NotificationChannelsComponent {
items: MenuItem[] | undefined;
  ngOnInit() {
    this.items = [
      { label: 'لوحة المعلومات' },
      { label: 'اعدادات الاشعارات' },
    ];
  }
}
