import { Component, inject } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { EditInfoPopupComponent } from '../edit-info-popup/edit-info-popup.component';
import { ChangePasswordPopupComponent } from '../change-password-popup/change-password-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { UserProfileFilter } from '@/models/features/user-profile/user-profile-filter';
import { UserProfileService } from '@/services/features/user-profile.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { UserProfile } from '@/models/features/user-profile/user-profile';

@Component({
  selector: 'app-profile',
  imports: [Breadcrumb, TranslatePipe, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export default class ProfileComponent extends BaseListComponent<
  UserProfile,
  EditInfoPopupComponent,
  UserProfileService,
  UserProfileFilter
> {
  userService = inject(UserProfileService);
  override get filterModel(): UserProfileFilter {
    return new UserProfileFilter();
  }
  override set filterModel(val: UserProfileFilter) {
    this.filterModel = val;
  }
  override get service(): UserProfileService {
    return this.userService;
  }
  override openDialog(model: UserProfile): void {
    this.openBaseDialog(EditInfoPopupComponent as any, model, ViewModeEnum.EDIT);
  }
  override initListComponent(): void {
    console.log('initListComponent');
  }
  protected override mapModelToExcelRow(model: UserProfile): { [key: string]: any } {
    console.log('mapModelToExcelRow');
    return {};
  }
  dialog = inject(MatDialog);

  override dialogSize = {
    width: '100%',
    maxWidth: '504px',
  };

  openEditInfoDialog(): void {
    this.dialog.open(EditInfoPopupComponent, this.dialogSize).afterClosed().subscribe();
  }

  openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordPopupComponent, this.dialogSize).afterClosed().subscribe();
  }
  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'PROFILE_PAGE.PROFILE' }];
  }
}
