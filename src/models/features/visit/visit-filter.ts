export class VisitFilter {
  nationalId!: string;
  fullName!: string;
  fkTargetDepartmentId!: number;
  dateFrom!: Date;
  dateTo!: Date;
  visitStatus!: number;
  creationUserId!: number;
}
