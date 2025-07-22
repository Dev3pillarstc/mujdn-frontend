import { Component, inject } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { EditInfoPopupComponent } from '../edit-info-popup/edit-info-popup.component';
import { ChangePasswordPopupComponent } from '../change-password-popup/change-password-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  imports: [Breadcrumb],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export default class ProfileComponent {
  breadcrumbs: MenuItem[] | undefined;
  home: MenuItem | undefined;
  dialog = inject(MatDialog);

  dialogSize = {
    width: '100%',
    maxWidth: '504px',
  };

  ngOnInit() {
    this.breadcrumbs = [{ label: 'لوحة المعلومات' }, { label: 'الملف الشخصي' }];
  }

  openEditInfoDialog(): void {
    this.dialog.open(EditInfoPopupComponent, this.dialogSize).afterClosed().subscribe();
  }

  openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordPopupComponent, this.dialogSize).afterClosed().subscribe();
  }
}
