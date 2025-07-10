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
import { permissionResolver } from '@/resolvers/lookups/permission.resolver';
import { workShiftResolver } from '@/resolvers/lookups/work-shift.resolver';
import { attendanceResolver } from '@/resolvers/features/attendance-log.resolver';
import { loginResolver } from '@/resolvers/login.resolver';

export const routes: Routes = [
  // ✅ Protected routes

  // ✅ Redirect root "/" to /auth/login — public
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },

  // ✅ Optional legacy redirect
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  // ✅ Auth layout and login
  {
    path: 'auth',
    loadComponent: () => import('@/views/layout/auth/auth-layout/auth-layout.component'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        resolve: { notUsed: loginResolver },
        loadComponent: () => import('@/views/auth/login/login.component'),
      },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: [ROLES_ENUM.EMPLOYEE] },
    loadComponent: () => import('@/views/layout/main/main-layout/main-layout.component'),
    children: [
      {
        path: 'home',
        loadComponent: () => import('@/views/home/home.component'),
        data: { routeId: RouteIdsEnum.HOME },
      },
      {
        path: 'employees',
        resolve: { list: userResolver },
        loadComponent: () =>
          import('@/views/features/employee/employee-list/employee-list.component'),
        data: { roles: [ROLES_ENUM.HR_OFFICER, ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.EMPLOYEES },
      },
      {
        path: 'attendance-logs',
        canActivate: [authGuard],
        resolve: { list: attendanceResolver },
        data: {
          roles: [ROLES_ENUM.DEPARTMENT_MANAGER, ROLES_ENUM.HR_OFFICER],
          routeId: RouteIdsEnum.ATTENDANCE_LOGS,
        },
        loadComponent: () =>
          import(
            '@/views/features/attendance-log/attendance-log-list/attendance-log-list.component'
          ),
      },
      {
        path: 'nationalities',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.NATIONALITIES },
        resolve: { list: nationalitiesResolver },
        loadComponent: () =>
          import(
            '@/views/features/lookups/nationality/nationality-list/nationality-list.component'
          ),
      },
      {
        path: 'cities',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.CITIES },
        resolve: { list: cityResolver },
        loadComponent: () => import('@/views/features/lookups/city/city-list/city-list.component'),
      },
      {
        path: 'regions',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.REGIONS },
        resolve: { list: regionResolver },
        loadComponent: () =>
          import('@/views/features/lookups/region/region-list/region-list.component').then(
            (m) => m.RegionListComponent
          ),
      },
      {
        path: 'permission-reasons',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.PERMISSION_REASONS },
        resolve: { list: permissionReasonResolver },
        loadComponent: () =>
          import(
            '@/views/features/lookups/permission/permission-reason-list/permission-reason-list.component'
          ),
      },
      {
        path: 'notification-channels',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.NOTIFICATION_CHANNELS },
        resolve: { channel: notificationChannelResolver },
        loadComponent: () =>
          import('@/views/features/settings/notification-channels/notification-channels.component'),
      },
      {
        path: 'permissions',
        canActivate: [authGuard],
        data: { routeId: RouteIdsEnum.PERMISSIONS },
        resolve: { list: permissionResolver },
        loadComponent: () =>
          import('@/views/features/permissions/permissions-list/permissions-list.component'),
      },
      {
        path: 'holidays',
        canActivate: [authGuard],
        data: { routeId: RouteIdsEnum.HOLIDAYS },
        resolve: { list: holidayResolver },
        loadComponent: () =>
          import('@/views/features/lookups/holidays/holidays-list/holidays-list.component'),
      },
      {
        path: 'employee-holidays',
        loadComponent: () =>
          import('@/views/features/lookups/holidays/employee-holidays/employee-holidays.component'),
      },
      {
        path: 'departments',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.ADMIN], routeId: RouteIdsEnum.DEPARTMENTS },
        resolve: { list: departmentResolver },
        loadComponent: () =>
          import('@/views/features/department/department-list/department-list.component'),
      },
      {
        path: 'work-shifts',
        canActivate: [authGuard],
        data: { roles: [ROLES_ENUM.HR_OFFICER], routeId: RouteIdsEnum.WORK_SHIFTS },
        resolve: { list: workShiftResolver },
        loadComponent: () =>
          import(
            '@/views/features/lookups/work-shifts/work-shifts-list/work-shifts-list.component'
          ),
      },
      {
        path: 'work-shifts-assignment',
        data: { routeId: RouteIdsEnum.WORK_SHIFT_ASSIGNMENT },
        loadComponent: () =>
          import(
            '@/views/features/lookups/work-shifts/work-shifts-assignment/work-shifts-assignment.component'
          ),
      },
      {
        path: 'temp-shifts',
        data: { routeId: RouteIdsEnum.WORK_SHIFT_TEMP },
        loadComponent: () =>
          import('@/views/features/lookups/work-shifts/temp-shifts/temp-shifts.component'),
      },
      {
        path: 'outside-mission',
        loadComponent: () =>
          import(
            '@/views/features/outside-mission/outside-mission-list/outside-mission-list.component'
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('@/views/features/lookups/notifiactions/notifiactions.component'),
      },
    ],
  },

  // 404 handler
  {
    path: '404',
    loadComponent: () => import('@/views/shared/not-found/not-found.component'),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
