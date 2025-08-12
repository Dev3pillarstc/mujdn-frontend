import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BlackListNationalitiesComponent } from '../black-list-nationalities/black-list-nationalities.component';
import { BlacklistedNationalIdListComponent } from '../black-list-national-ids/blacklisted-national-ids-list.component';

@Component({
  selector: 'app-blacklisted-container',
  imports: [
    Breadcrumb,
    TabsModule,
    BlackListNationalitiesComponent,
    BlacklistedNationalIdListComponent,
  ],
  templateUrl: './blacklisted-container.component.html',
  styleUrl: './blacklisted-container.component.scss',
})
export default class BlacklistedContainerComponent {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'معايير حظر الزائرين' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
}
