import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  Input,
  OnInit,
  runInInjectionContext,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MenuItem } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { AddNewMissionPopupComponent } from '../popups/add-new-mission-popup/add-new-mission-popup.component';
import { ViewMissionDataPopupComponent } from '../popups/view-mission-data-popup/view-mission-data-popup.component';
import { AssignEmployeesComponent } from '../popups/assign-employees/assign-employees.component';
import { SplitButton, SplitButtonModule } from 'primeng/splitbutton';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { WorkMission } from '@/models/features/business/work-mission';
import WorkMissionFilter from '@/models/features/business/work-mission-filter';
import { WorkMissionService } from '@/services/features/business/work-mission.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginationInfo } from '@/models/shared/response/pagination-info';
import { TranslatePipe } from '@ngx-translate/core';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { MenuModule } from 'primeng/menu';
import { UserProfileDataWithNationalId } from '@/models/features/business/user-profile-data-with-national-id';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-assign-and-view-missions-tab',
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    TableModule,
    SplitButton,
    InputTextModule,
    PaginatorModule,
    TranslatePipe,
    MenuModule,
    SplitButtonModule,
  ],
  templateUrl: './assign-and-view-missions-tab.component.html',
  styleUrl: './assign-and-view-missions-tab.component.scss',
})
export class AssignAndViewMissionsTabComponent
  extends BaseListComponent<
    WorkMission,
    ViewMissionDataPopupComponent,
    WorkMissionService,
    WorkMissionFilter
  >
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };

  // Services and dependencies
  workMissionService = inject(WorkMissionService);
  private injector = inject(Injector);
  dialog = inject(MatDialog);

  // Filter model
  filterOptions: WorkMissionFilter = new WorkMissionFilter();

  assignableEmployeesPaginationInfo: PaginationInfo = new PaginationInfo();
  // Accept signals as inputs
  @Input() missionsSignal!: WritableSignal<PaginatedList<WorkMission>>;
  @Input() assignableEmployeesSignal!: WritableSignal<
    PaginatedListResponseData<UserProfileDataWithNationalId>
  >;
  @Input() departmentsSignal!: WritableSignal<BaseLookupModel[]>;

  // Component data
  missions: WorkMission[] = [];
  assignableEmployees: UserProfileDataWithNationalId[] = [];
  departments: BaseLookupModel[] = [];

  // Base class overrides
  override get filterModel(): WorkMissionFilter {
    return this.filterOptions;
  }

  override set filterModel(val: WorkMissionFilter) {
    this.filterOptions = val;
  }

  override get service(): WorkMissionService {
    return this.workMissionService;
  }

  override openDialog(model?: WorkMission): void {
    const mission = model || new WorkMission();
    const viewMode = model?.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(AddNewMissionPopupComponent as any, mission, viewMode);
  }

  override initListComponent(): void {
    // Initialize effects to sync with parent signals
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const currentMissions = this.missionsSignal?.();
        if (currentMissions) {
          this.list = currentMissions.list || [];
          this.paginationInfo = currentMissions.paginationInfo || null;
        }
      });

      effect(() => {
        const currentEmployees = this.assignableEmployeesSignal?.();
        if (currentEmployees?.data.list) {
          this.assignableEmployees = currentEmployees.data.list;
          this.assignableEmployeesPaginationInfo = currentEmployees.data.paginationInfo || null;
        }
      });

      effect(() => {
        const currentDepartments = this.departmentsSignal?.();
        if (currentDepartments) {
          this.departments = currentDepartments;
        }
      });
    });
  }

  protected override getBreadcrumbKeys(): {
    labelKey: string;
    icon?: string;
    routerLink?: string;
  }[] {
    return [{ labelKey: 'dashboard' }, { labelKey: 'workMissions' }];
  }

  protected override mapModelToExcelRow(model: WorkMission): { [key: string]: any } {
    return {
      'اسم المهمة بالعربية': model.nameAr,
      'اسم المهمة بالانجليزية': model.nameEn,
      'تاريخ البداية': model.startDate,
      'تاريخ النهاية': model.endDate,
    };
  }
  addOrEditModel(mission?: WorkMission): void {
    this.openDialog(mission ?? new WorkMission());
  }
  // Component methods

  viewMission(mission: WorkMission): void {
    const missionObj = mission || new WorkMission();
    const viewMode = ViewModeEnum.EDIT;
    this.openBaseDialog(ViewMissionDataPopupComponent as any, mission, viewMode);
  }

  openAssignEmployeesDialog(mission: WorkMission): void {
    const missionObj = mission || new WorkMission();
    const viewMode = ViewModeEnum.EDIT;
    const data = { employees: this.assignableEmployees, departments: this.departments };
    this.openBaseDialog(AssignEmployeesComponent as any, mission, viewMode, data);
  }

  editMission(mission: WorkMission): void {
    const dialogRef = this.dialog.open(AddNewMissionPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
      data: { mission, isEdit: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.loadData();
      }
    });
  }

  deleteMission(missionId: number): void {
    // Implement confirmation dialog and delete logic
    this.deleteModel(missionId);
  }

  getMenuItems(mission: WorkMission): MenuItem[] {
    return [
      {
        label: 'تعديل المهمة',
        icon: 'pi pi-pencil',
        command: () => {
          this.addOrEditModel(mission);
        },
      },
      {
        separator: true,
      },
      {
        label: 'حذف المهمة',
        icon: 'pi pi-trash',
        command: () => {
          this.deleteMission(mission.id);
        },
      },
    ];
  }
}
