import { Routes } from '@angular/router';
import { authGuard } from '@/guards/auth-guard';
import { ROLES_ENUM } from '@/enums/roles-enum';
import { nationalitiesResolver } from '@/resolvers/lookups/nationalities.resolver';
import { permissionReasonResolver } from '@/resolvers/lookups/permission-reason.resolver';
import { cityResolver } from '@/resolvers/lookups/city.resolver';
import { userResolver } from '@/resolvers/user.resolver';
import { regionResolver } from '@/resolvers/lookups/region.resolver';
import { notificationChannelResolver } from '@/resolvers/setting/notification-channel.resolver';
import { RouteIdsEnum } from '@/enums/route-ids-enum';
import { departmentResolver } from '@/resolvers/lookups/department.resolver';
import { holidayResolver } from '@/resolvers/lookups/holiday.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    // canActivate: [authGuard],
    data: { roles: [ROLES_ENUM.EMPLOYEE] },
    loadComponent: () => import('@/views/layout/main/main-layout/main-layout.component'),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('../views/home/home.component'),
        data: {
          routeId: RouteIdsEnum.HOME,
        },
      },
      {
        path: 'employees',
        // canActivate: [authGuard],
        // data: { roles: [ROLES_ENUM.DEPARTMENT_MANAGER] },
        resolve: { list: userResolver },
        loadComponent: () =>
          import('../views/features/employee/employee-list/employee-list.component'),
        data: {
          roles: [ROLES_ENUM.HR_OFFICER],
          routeId: RouteIdsEnum.EMPLOYEES,
        },
      },
      {
        path: 'attendance-logs',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.DEPARTMENT_MANAGER], routeId: RouteIdsEnum.ATTENDANCE_LOGS },
        loadComponent: () =>
          import(
            '../views/features/attendance-log/attendance-log-list/attendance-log-list.component'
          ),
      },
      {
        path: 'nationalities',
        canActivate: [authGuard],
        resolve: { list: nationalitiesResolver },
        loadComponent: () =>
          import(
            '../views/features/lookups/nationality/nationality-list/nationality-list.component'
          ),
        data: { roles: [ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.NATIONALITIES },
      },
      {
        path: 'cities',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.CITIES },
        resolve: { list: cityResolver },
        loadComponent: () => import('../views/features/lookups/city/city-list/city-list.component'),
      },
      {
        path: 'regions',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.REGIONS },
        resolve: { list: regionResolver },
        loadComponent: () =>
          import('../views/features/lookups/region/region-list/region-list.component').then(
            (m) => m.RegionListComponent
          ),
      },
      {
        path: 'permission-reasons',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.HR_OFFICER], routeId: RouteIdsEnum.PERMISSION_REASONS },
        resolve: { list: permissionReasonResolver },
        loadComponent: () =>
          import(
            '../views/features/lookups/permission/permission-reason-list/permission-reason-list.component'
          ),
      },
      {
        path: 'notification-channels',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.NOTIFICATION_CHANNELS },
        resolve: {
          channel: notificationChannelResolver,
        },
        loadComponent: () =>
          import(
            '../views/features/settings/notification-channels/notification-channels.component'
          ),
      },
      {
        path: 'permissions',
        loadComponent: () =>
          import('../views/features/permissions/permissions-list/permissions-list.component'),
      },
      {
        path: 'holidays-list',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.HR_OFFICER], routeId: RouteIdsEnum.HOLIDAYS },
        resolve: { list: holidayResolver },
        loadComponent: () =>
          import('../views/features/lookups/holidays/holidays-list/holidays-list.component'),
      },
      {
        path: 'employee-holidays',
        loadComponent: () =>
          import(
            '../views/features/lookups/holidays/employee-holidays/employee-holidays.component'
          ),
      },
      {
        path: 'department-list',
        resolve: { list: departmentResolver },
        loadComponent: () =>
          import('../views/features/department/department-list/department-list.component'),
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('@/views/layout/auth/auth-layout/auth-layout.component'),
    children: [
      {
        path: 'login',
        loadComponent: () => import('../views/auth/login/login.component'),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () => import('@/views/shared/not-found/not-found.component'),
  },
  { path: '**', redirectTo: '404' },
];
