export class AttendanceReportFilter {
  declare fullNameAr?: string;
  declare fullNameEn?: string;
  declare nationalId?: string;
  declare dateFrom?: Date | null;
  declare dateTo?: Date | null;
  declare departmentIds?: number[] | null;
  declare statusId?: number | null;
  declare processingStatus?: number | null;
}
