import {Component, ElementRef, ViewChild} from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [SidebarModule, PanelMenuModule, RouterModule, CommonModule],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  @ViewChild('sidebarContainer', { static: true }) sidebarContainer!: ElementRef;
  sidebarVisible = false;
  isMobile = window.innerWidth <= 768;
  openedSubmenus = new Set<MenuItem>();

  menuItems = [
    {
      label: 'لوحة المعلومات',
      iconUrl: 'assets/icons/menu-icons/home.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'تقرير الحضور و الانصراف',
      iconUrl: 'assets/icons/menu-icons/icon-stroke-rounded.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'حركات الحضور و الانصراف',
      iconUrl: 'assets/icons/menu-icons/icon.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'الادارات',
      iconUrl: 'assets/icons/menu-icons/tools.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'قائمة الموظفين',
      iconUrl: 'assets/icons/menu-icons/employees.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'مسائلات توثيق التواجد',
      iconUrl: 'assets/icons/menu-icons/icon2.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'الاستئذانات',
      iconUrl: 'assets/icons/menu-icons/permissions.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'الموظفون المُكلفون',
      iconUrl: 'assets/icons/menu-icons/icon3.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'قائمة الاجازات و الأعياد',
      iconUrl: 'assets/icons/menu-icons/vacations.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'الإعدادات',
      iconUrl: 'assets/icons/menu-icons/settings.svg',
      children: [
        {
          label: 'اعدادات الأذونات',
          // iconUrl: 'assets/icons/permission.svg',
          routerLink: ['/settings/permissions'],
        },
        {
          label: 'اعدادات الاشعارات',
          // iconUrl: 'assets/icons/notification.svg',
          routerLink: ['/settings/notifications'],
        },
        {
          label: 'قائمة الجنسيات',
          // iconUrl: 'assets/icons/nationality.svg',
          routerLink: ['/settings/nationalities'],
        },
      ],
    },
  ];

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.sidebarVisible = true;
      }
    });

    if (!this.isMobile) {
      this.sidebarVisible = true;
    }
  }

  toggleSubmenu(item: MenuItem) {
    if (this.openedSubmenus.has(item)) {
      this.openedSubmenus.delete(item);
    } else {
      this.openedSubmenus.add(item);
    }
  }

  isSubmenuOpen(item: MenuItem): boolean {
    return this.openedSubmenus.has(item);
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }
}
