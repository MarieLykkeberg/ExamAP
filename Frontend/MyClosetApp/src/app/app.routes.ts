// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  // 1) Redirect root to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2) Auth (no layout)
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  // 3) App (with LayoutComponent wrapper)
  {
    path: '',
    component: LayoutComponent,
    children: [

      // ── Wardrobe module ───────────────────────────────
      {
        path: 'wardrobe',
        children: [
          // 1. DETAILS must come first
          {
            path: 'details/:id',
            loadComponent: () =>
              import('./pages/wardrobe/item-details/item-details.component')
                .then(m => m.ItemDetailsComponent)
          },
          // 2. ADD
          {
            path: 'add',
            loadComponent: () =>
              import('./pages/add/add.component').then(m => m.AddComponent)
          },
          // 3. LIST (empty) — only match exactly "/wardrobe"
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./pages/wardrobe/wardrobe.component')
                .then(m => m.WardrobeComponent)
          }
        ]
      },

      {
        path: 'styling',
        loadComponent: () =>
          import('./pages/styling/styling.component').then(m => m.StylingComponent)
      },
      { path: 'profile/:id', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
    ]
  },

  // 4) Catch-all → login
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];