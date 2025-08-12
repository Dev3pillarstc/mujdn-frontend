import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BlackListNationalitiesComponent } from '../black-list-nationalities/black-list-nationalities.component';
import { BlackListNationalIdsComponent } from '../black-list-national-ids/black-list-national-ids.component';

@Component({
  selector: 'app-black-list-container',
  imports: [Breadcrumb, TabsModule, BlackListNationalitiesComponent, BlackListNationalIdsComponent],
  templateUrl: './black-list-container.component.html',
  styleUrl: './black-list-container.component.scss',
})
export default class BlackListContainerComponent {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'معايير حظر الزائرين' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
}
