import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DialogRef } from '@angular/cdk/dialog';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { PRESENCE_INQUIRY_STATUS_ENUM } from '@/enums/presence-inquiry-status-enum';
import { USER_PRESENCE_INQUIRY_STATUS_ENUM } from '@/enums/user-presence-inquiry-status-enum';
import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { AlertService } from '@/services/shared/alert.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { M } from '@angular/material/dialog.d-B5HZULyo';
import { Observable } from 'rxjs';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UserProfilePresenceInquiry } from '@/models/features/presence-inquiry/user-profile-presence-inquiry';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { UserProfileService } from '@/services/features/user-profile.service';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { UserProfileFilter } from '@/models/features/user-profile/user-profile-filter';
import { UserFilter } from '@/models/auth/user-filter';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginationInfo } from '@/models/shared/response/pagination-info';
import { TranslatePipe } from '@ngx-translate/core';
interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-assign-employee-responsibility-popup',
  imports: [
    FormsModule,
    Select,
    DatePickerModule,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    TableModule,
    PaginatorModule,
    TranslatePipe,
  ],
  templateUrl: './assign-employee-responsibility-popup.component.html',
  styleUrl: './assign-employee-responsibility-popup.component.scss',
})
export class AssignEmployeeResponsibilityPopupComponent
  extends BasePopupComponent<PresenceInquiry>
  implements OnInit
{
  override afterSave(model: PresenceInquiry, dialogRef: M<any, any>): void {}

  beforeSave(model: PresenceInquiry, form: FormGroup) {
    return form.valid;
  }
  declare model: PresenceInquiry;
  declare form: FormGroup;
  first: number = 0;
  rows: number = 10;

  paginationInfo: PaginationInfo = new PaginationInfo();
  paginationParams: PaginationParams = new PaginationParams();
  alertService = inject(AlertService);
  fb = inject(FormBuilder);
  data = inject(MAT_DIALOG_DATA);
  inquiryStatusEnum = PRESENCE_INQUIRY_STATUS_ENUM;
  userInquiryStatusEnum = USER_PRESENCE_INQUIRY_STATUS_ENUM;
  statusGroups: any[] = [];
  departments: BaseLookupModel[] = [];
  departmentService = inject(DepartmentService);
  userProfileService = inject(UserProfileService);
  users: UserProfilePresenceInquiry[] = [];
  filterModel: UserFilter = new UserFilter();

  override initPopup() {
    this.model = this.data.model ?? new PresenceInquiry();
    this.departmentService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.departments = res;
    });
    this.loadUsersAvailableForPresenceInquiriesPaginated();
  }

  loadUsersAvailableForPresenceInquiriesPaginated() {
    this.userProfileService
      .loadUsersAvailableForPresenceInquiriesPaginated(this.paginationParams, {
        ...this.filterModel!,
      })
      .subscribe((res: PaginatedList<UserProfilePresenceInquiry>) => {
        this.users = res.list; // or res depending on what you want
      });
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  override prepareModel(
    model: PresenceInquiry,
    form: FormGroup
  ): PresenceInquiry | Observable<PresenceInquiry> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  override saveFail(error: Error): void {
    // optional error handling
  }
  onPageChange(event: PaginatorState, isStoredProcedure: boolean = false) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadUsersAvailableForPresenceInquiriesPaginated();
  }

  getDepartmentName(id: number): string {
    const department = this.departments.find((d) => d.id === id);
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (department?.nameEn ?? '')
      : (department?.nameAr ?? '');
  }

  search() {
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.loadUsersAvailableForPresenceInquiriesPaginated();
  }

  resetSearch() {
    this.filterModel = new UserFilter();
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadUsersAvailableForPresenceInquiriesPaginated();
  }
  getPropertyName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }
}
