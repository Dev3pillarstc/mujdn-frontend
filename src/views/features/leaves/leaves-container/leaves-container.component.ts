import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TabsModule } from 'primeng/tabs';
import { MyLeavesComponent } from '../my-leaves/my-leaves.component';
import { OtherLeavesComponent } from '../other-leaves/other-leaves.component';

@Component({
  selector: 'app-leaves-container',
  imports: [Breadcrumb, TabsModule, MyLeavesComponent, OtherLeavesComponent],
  templateUrl: './leaves-container.component.html',
  styleUrl: './leaves-container.component.scss',
})
export default class LeavesContainerComponent {
  activeTabIndex = 0;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'طلبات الاجازات' }];
  }
}
