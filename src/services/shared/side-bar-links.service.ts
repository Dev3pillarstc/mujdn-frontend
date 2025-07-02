import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { AuthService } from '@/services/auth/auth.service';
import { RouteIdsEnum } from '@/enums/route-ids-enum';
import { MenuItem } from '@/models/shared/menu-item';

@Injectable({
  providedIn: 'root',
})
export class SideBarLinksService {
  menuItems: MenuItem[] = [
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
      routerLink: ['/departments'],
    },
    {
      label: 'قائمة الموظفين',
      iconUrl: 'assets/icons/menu-icons/employees.svg',
      routerLink: ['/employees'],
      routeId: RouteIdsEnum.EMPLOYEES,
    },
    {
      label: 'مسائلات توثيق التواجد',
      iconUrl: 'assets/icons/menu-icons/icon2.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'الأذونات',
      iconUrl: 'assets/icons/menu-icons/permissions.svg',
      routerLink: ['/permissions'],
      routeId: RouteIdsEnum.PERMISSIONS,
    },
    {
      label: 'الموظفون المُكلفون',
      iconUrl: 'assets/icons/menu-icons/icon3.svg',
      routerLink: ['/dashboard'],
    },
    {
      label: 'ورديات العمل',
      iconUrl: 'assets/icons/menu-icons/shifts-icon.svg',
      routerLink: ['/dashboard'],
      routeId: RouteIdsEnum.WORK_SHIFT_LIST,
    },
    {
      label: 'ورديات العمل المؤقتة',
      iconUrl: 'assets/icons/menu-icons/sifts-add-icon.svg',
      routerLink: ['/dashboard'],
      routeId: RouteIdsEnum.WORK_SHIFT_TEMP,
    },
    {
      label: 'اسناد ورديات عمل',
      iconUrl: 'assets/icons/menu-icons/sifts-add-icon.svg',
      routerLink: ['/dashboard'],
      routeId: RouteIdsEnum.WORK_SHIFT_ASSIGNMENT,
    },
    {
      label: 'قائمة الاجازات و الأعياد',
      iconUrl: 'assets/icons/menu-icons/vacations.svg',
      routerLink: ['/holidays'],
      routeId: RouteIdsEnum.HOLIDAYS,
    },

    {
      label: 'ورديات العمل',
      iconUrl: 'assets/icons/time-icon.svg',
      children: [
        {
          label: 'اعدادات ورديات العمل',
          routerLink: ['/work-shifts'],
          routeId: RouteIdsEnum.WORK_SHIFTS,
        },
      ],
    },
    {
      label: 'الإعدادات',
      iconUrl: 'assets/icons/menu-icons/settings.svg',
      children: [
        {
          label: 'اعدادات الأذونات',
          routerLink: ['/permission-reasons'],
          routeId: RouteIdsEnum.PERMISSION_REASONS,
        },
        {
          label: 'اعدادات الاشعارات',
          routerLink: ['/notification-channels'],
          routeId: RouteIdsEnum.NOTIFICATION_CHANNELS,
        },
        {
          label: 'قائمة الجنسيات',
          routerLink: ['/nationalities'],
          routeId: RouteIdsEnum.NATIONALITIES,
        },
        {
          label: 'قائمة المدن',
          routerLink: ['/cities'],
          routeId: RouteIdsEnum.CITIES,
        },
        {
          label: 'قائمة المناطق',
          routerLink: ['/regions'],
          routeId: RouteIdsEnum.REGIONS,
        },
      ],
    },
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  /** Public method to get menu items filtered by current user roles */
  getSidebarLinks(): MenuItem[] {
    const userRoles = this.authService.getUser().value?.roles;
    const allRoutes = this.flattenRouterConfig(this.router.config);

    const filterMenuItems = (menuItems: MenuItem[]): MenuItem[] => {
      const filtered: MenuItem[] = [];

      for (const item of menuItems) {
        if (item.routeId && !item.children) {
          const matchedRoute = allRoutes.find((r) => r.data?.['routeId'] === item.routeId);
          const allowedRoles = matchedRoute?.data?.['roles'] as string[] | undefined;

          const isAllowed = !allowedRoles || allowedRoles.some((role) => userRoles?.includes(role));
          if (isAllowed) {
            filtered.push(item);
          }
        } else if (!item.routeId && !item.children) {
          // Public item
          filtered.push(item);
        }

        if (item.children) {
          const allowedChildren = filterMenuItems(item.children);
          if (allowedChildren.length > 0) {
            filtered.push({ ...item, children: allowedChildren });
          }
        }
      }

      return filtered;
    };

    return filterMenuItems(this.menuItems);
  }

  /** Recursively flattens the route tree from Angular Router config */
  private flattenRouterConfig(routes: Route[]): Route[] {
    let flatRoutes: Route[] = [];

    for (const route of routes) {
      flatRoutes.push(route);
      if (route.children) {
        flatRoutes = flatRoutes.concat(this.flattenRouterConfig(route.children));
      }
    }

    return flatRoutes;
  }
}
