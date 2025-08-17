import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { AllVisitRequestListComponent } from '../all-visit-request-list/all-visit-request-list.component';
import { MyCreatedVisitRequestListComponent } from '../my-created-visit-request-list/my-created-visit-request-list.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-visit-request-container',
  imports: [
    Breadcrumb,
    TabsModule,
    AllVisitRequestListComponent,
    MyCreatedVisitRequestListComponent,
    TranslatePipe,
  ],
  templateUrl: './visit-request-container.component.html',
  styleUrl: './visit-request-container.component.scss',
})
export default class VisitRequestContainerComponent {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'معايير حظر الزائرين' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
}
