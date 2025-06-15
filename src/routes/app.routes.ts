import { Routes } from '@angular/router';
import { authGuard } from '@/guards/auth-guard';
import { ROLES_ENUM } from '@/enums/roles-enum';

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
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN] },
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
        loadComponent: () =>
          import(
            '../views/features/lookups/nationality/nationality-list/nationality-list.component'
          ),
      },
      {
        path: 'permissions',
        loadComponent: () =>
          import('../views/features/lookups/permission/permission-list/permission-list.component'),
      },
      {
        path: 'notification-channels',
        loadComponent: () =>
          import(
            '../views/features/settings/notification-channels/notification-channels.component'
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
