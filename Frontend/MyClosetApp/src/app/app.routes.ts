import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { WardrobeComponent } from './pages/wardrobe/wardrobe.component';
import { ItemDetailsComponent } from './pages/wardrobe/item-details/item-details.component';
import { AddComponent } from './pages/add/add.component';
import { StylingComponent } from './pages/styling/styling.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  // Redirect root to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth (no layout)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // App (with LayoutComponent wrapper)
  {
    path: '',
    component: LayoutComponent,
    children: [
      // Wardrobe module 
      {
        path: 'wardrobe',
        children: [
          { path: 'details/:id', component: ItemDetailsComponent },
          { path: 'edit/:id', component: ItemDetailsComponent },
          { path: 'add', component: AddComponent },
          { path: '', pathMatch: 'full', component: WardrobeComponent }
        ]
      },

      // Styling page 
      { path: 'styling', component: StylingComponent },

      // Profile 
      { path: 'profile', component: ProfileComponent }
    ]
  },

  // Catch-all → login
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];