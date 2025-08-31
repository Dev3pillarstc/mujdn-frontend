import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Select } from 'primeng/select';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-devices-configuration-modal',
  imports: [Select],
  templateUrl: './devices-configuration-modal.component.html',
  styleUrl: './devices-configuration-modal.component.scss',
})
export class DevicesConfigurationModalComponent {
  dialogRef = inject(DialogRef);
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  close() {
    this.dialogRef.close();
  }
}
