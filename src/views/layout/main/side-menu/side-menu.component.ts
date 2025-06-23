import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/services/auth/auth.service';
import { SideBarLinksService } from '@/services/shared/side-bar-links.service';
import { MenuItem } from '@/models/shared/menu-item';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [SidebarModule, PanelMenuModule, RouterModule, CommonModule],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent implements OnInit {
  @ViewChild('sidebarContainer', { static: true }) sidebarContainer!: ElementRef;
  sidebarVisible = false;
  isMobile = window.innerWidth <= 768;
  openedSubmenus = new Set<MenuItem>();
  authService = inject(AuthService);
  sidebarLinksService = inject(SideBarLinksService);
  menuItems: MenuItem[] = [];

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

  ngOnInit() {
    this.authService.getUser().subscribe((_) => {
      this.menuItems = this.sidebarLinksService.getSidebarLinks();
    });
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

  logout() {
    this.authService.logout().subscribe();
  }
}
