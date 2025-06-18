import { Routes } from '@angular/router';
import { authGuard } from '@/guards/auth-guard';
import { ROLES_ENUM } from '@/enums/roles-enum';
import { nationalitiesResolver } from '@/resolvers/lookups/nationalities.resolver';
import { permissionReasonResolver } from '@/resolvers/lookups/permission-reason.resolver';
import { cityResolver } from '@/resolvers/lookups/city.resolver';
import { notificationChannelResolver } from '@/resolvers/setting/notification-channel.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: [ROLES_ENUM.EMPLOYEE] },
    loadComponent: () => import('@/views/layout/main/main-layout/main-layout.component'),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('../views/home/home.component'),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('../views/features/employee/employee-list/employee-list.component'),
      },
      {
        path: 'attendance-logs',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.DEPARTMENT_MANAGER] },
        loadComponent: () =>
          import(
            '../views/features/attendance-log/attendance-log-list/attendance-log-list.component'
          ),
      },
      {
        path: 'nationalities',
        resolve: { list: nationalitiesResolver },
        loadComponent: () =>
          import(
            '../views/features/lookups/nationality/nationality-list/nationality-list.component'
          ),
      },
      {
        path: 'cities',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN] },
        resolve: { list: cityResolver },
        loadComponent: () => import('../views/features/lookups/city/city-list/city-list.component'),
      },
      {
        path: 'permission-reasons',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN] },
        resolve: { list: permissionReasonResolver },
        loadComponent: () =>
          import(
            '../views/features/lookups/permission/permission-reason-list/permission-reason-list.component'
          ),
      },
      {
        path: 'notification-channels',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN] },
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
