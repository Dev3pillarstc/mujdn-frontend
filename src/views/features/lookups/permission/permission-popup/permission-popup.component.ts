import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-permission-popup',
  imports: [InputTextModule],
  templateUrl: './permission-popup.component.html',
  styleUrl: './permission-popup.component.scss',
})
export class PermissionPopupComponent {}
