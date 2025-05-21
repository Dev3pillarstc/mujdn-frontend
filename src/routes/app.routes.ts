import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('../views/home/home.component'),
  },
  {
    path: 'login',
    loadComponent: () => import('../views/login/login.component'),
  },
  {
    path: '404',
    loadComponent: () => import('../views/not-found/not-found.component'),
  },
  { path: '**', redirectTo: '404' },
]
