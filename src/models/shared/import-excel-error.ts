export class ImportExcelError {
  totalRows!: number;
  successCount!: number;
  failureCount!: number;
  hasErrors = false;
  errorLogFile?: string;
}
