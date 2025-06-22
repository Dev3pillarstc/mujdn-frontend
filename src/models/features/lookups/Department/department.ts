import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { DepartmentInterceptor } from "@/model-interceptors/features/lookups/department-interceptor";
import { DepartmentService } from "@/services/features/lookups/department.service";
import { InterceptModel } from "cast-response";

const { send, receive } = new DepartmentInterceptor();

@InterceptModel({ send, receive })
export class Department extends BaseCrudModel<Department, DepartmentService> {
	override $$__service_name__$$: string = 'DepartmentService';
	declare nameEn: string;
	declare nameAr: string;
	declare fkParentDepartmentId?: number | null;
	declare fkRegionId?: number;
	declare fkCityId?: number;
	declare fkManagerId?: number | null;
	declare address?: string;
	declare phoneNumber?: string;
	declare fax?: string;
	declare regionNameEn?: string;
	declare regionNameAr?: string;
	declare cityNameEn?: string;
	declare cityNameAr?: string;
	declare managerNameEn?: string;
	declare managerNameAr?: string;
	isOneLevelVerification: boolean = false;
}
