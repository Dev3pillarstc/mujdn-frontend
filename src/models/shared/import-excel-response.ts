export class ImportExcelResponse {
  totalRows!: number;
  successCount!: number;
  failureCount!: number;
  hasErrors = false;
  errorLogFile?: string;
}
