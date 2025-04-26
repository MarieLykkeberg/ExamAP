// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  // 1) Redirect empty path → /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2) Auth (no layout wrapper)
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

  // 3) App routes inside your LayoutComponent
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then(m => m.HomeComponent)
      },

      // Wardrobe module
      {
        path: 'wardrobe',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/wardrobe/wardrobe.component').then(m => m.WardrobeComponent)
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import(
                './pages/wardrobe/item-details/item-details.component'
              ).then(m => m.ItemDetailsComponent)
          },
          {
            path: 'add',
            loadComponent: () =>
              import('./pages/add/add.component').then(m => m.AddComponent)
          }
        ]
      },

      {
        path: 'styling',
        loadComponent: () =>
          import('./pages/styling/styling.component').then(m => m.StylingComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // 4) Catch-all
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];