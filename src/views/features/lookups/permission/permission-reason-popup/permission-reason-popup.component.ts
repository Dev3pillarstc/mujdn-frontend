import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-permission-popup',
  imports: [InputTextModule],
  templateUrl: './permission-reason-popup.component.html',
  styleUrl: './permission-reason-popup.component.scss',
})
export class PermissionPopupComponent {}
