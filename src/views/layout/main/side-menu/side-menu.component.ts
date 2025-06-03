import { Component } from '@angular/core';
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
