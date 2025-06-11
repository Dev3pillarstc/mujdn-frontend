import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  selector: 'app-notification-settings',
  imports: [MatDialogModule, Breadcrumb],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.scss'
})
export default class NotificationSettingsComponent {
items: MenuItem[] | undefined;
  ngOnInit() {
    this.items = [
      { label: 'لوحة المعلومات' },
      { label: 'اعدادات الاشعارات' },
    ];
  }
}
