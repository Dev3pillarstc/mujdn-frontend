import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-permission-popup',
  imports: [InputTextModule],
  templateUrl: './permission-reason-popup.component.html',
  styleUrl: './permission-reason-popup.component.scss',
})
export class PermissionReasonPopupComponent {}
