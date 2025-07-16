export class AlertDialogData {
  declare icon: 'success' | 'error' | 'info' | 'warning'; // Extendable
  title?: string;
  declare messages: string[];
  buttonLabel?: string;
}
