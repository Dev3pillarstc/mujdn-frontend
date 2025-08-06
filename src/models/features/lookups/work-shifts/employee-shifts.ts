export default class EmployeeShifts {
    declare id: number;
    declare nameAr?: string;
    declare nameEn?: string;
    declare timeFrom?: string;
    declare timeTo?: string;
    declare attendanceBuffer?: number;
    declare leaveBuffer?: number;
    declare employeeWorkingDays: string;
    declare startDate: Date | string;
    declare endDate: Date | string;
}