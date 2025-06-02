import {Routes} from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    loadComponent: () => import('@/views/layout/main/main-layout/main-layout.component'),
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', loadComponent: () => import('../views/home/home.component')}
    ],
  },
  {
    path: '',
    loadComponent: () => import('@/views/layout/auth/auth-layout/auth-layout.component'),
    children: [
      {path: 'login', loadComponent: () => import('../views/auth/login/login.component')}
    ],
  },
  {
    path: '404',
    loadComponent: () => import('@/views/shared/not-found/not-found.component'),
  },
  {path: '**', redirectTo: '404'},
]
