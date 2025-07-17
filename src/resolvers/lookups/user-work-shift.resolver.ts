import UserWorkShift from "@/models/features/lookups/work-shifts/user-work-shifts";
import { PaginationParams } from "@/models/shared/pagination-params";
import { PaginatedList } from "@/models/shared/response/paginated-list";
import { DepartmentService } from "@/services/features/lookups/department.service";
import { ShiftService } from "@/services/features/lookups/shift.service";
import { UserWorkShiftService } from "@/services/features/lookups/user-workshift.service";
import { UserService } from "@/services/features/user.service";
import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { catchError, forkJoin, of } from "rxjs";

export const userWorkShiftResolver: ResolveFn<{
    userShifts: PaginatedList<UserWorkShift> | null;
    users: any;
    departments: any;
    shifts: any;
} | null> = () => {
    const userWorkShiftService = inject(UserWorkShiftService);
    const userService = inject(UserService);
    const departmentService = inject(DepartmentService);
    const shiftService = inject(ShiftService);

    return forkJoin({
        userShifts: userWorkShiftService.loadPaginated(new PaginationParams()),
        users: userService.getUsersWithDepartment(),
        shifts: shiftService.getLookup(),
        departments: departmentService.getLookup(),
    }).pipe(
        catchError((error) => {
            return of(null); // In case of error, return null to prevent navigation failure
        })
    );
};