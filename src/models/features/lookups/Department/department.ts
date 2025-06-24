import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { DepartmentInterceptor } from '@/model-interceptors/features/lookups/department-interceptor';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { InterceptModel } from 'cast-response';
import { DepartmentRegion } from './department-region';
import { DepartmentCity } from './department-city';
import { DepartmentManager } from './department-manager';

const { send, receive } = new DepartmentInterceptor();

@InterceptModel({ send, receive })
export class Department extends BaseCrudModel<Department, DepartmentService> {
  override $$__service_name__$$: string = 'DepartmentService';
  declare nameEn: string;
  declare nameAr: string;
  declare fkParentDepartmentId?: number | null;
  declare address?: string;
  declare phoneNumber?: string;
  declare fax?: string;
  declare fkRegionId?: number;
  declare region?: DepartmentRegion;
  declare fkCityId?: number;
  declare city?: DepartmentCity;
  declare fkManagerId?: number | null;
  declare manager?: DepartmentManager;
  declare childDepartments?: Department[];
  declare isOneLevelApproval: boolean;
}
