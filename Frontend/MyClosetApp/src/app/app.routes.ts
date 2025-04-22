import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FormsModule } from '@angular/forms';


export const routes: Routes = [

      {
        path: '',
        component: LayoutComponent, 
        children: [

          {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full'
          },
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
          {
            path: 'home',
            loadComponent: () =>
              import('./pages/home/home.component').then(m => m.HomeComponent)
          },

          {
            path: 'wardrobe',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./pages/wardrobe/wardrobe.component').then(m => m.WardrobeComponent)
              },
              {
                path: 'favorites',
                loadComponent: () =>
                  import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent)
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
          },

        ],
      }
    ];