import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent { // marked as export so it can be used by other components and modules
  // bound to login form inouts in the template. Set as blank - will automatically update when the user types in the form
  email = '';    
  password = ''; 

  // Constructor injects two services:
  // 1. Router - for navigating between pages
  // 2. AuthService - for handling authentication logic
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  // This method is called when the user clicks the login button
  login() {

    // Call the auth service to attempt login
    // subscribe() handles the response asynchronously
    this.authService.login(this.email, this.password).subscribe({
      // If login is successful:
      next: (user: User) => {
        console.log('Logged in user:', user);
        // Navigate to the wardrobe page
        this.router.navigate(['/wardrobe']);
      },
      // If login fails:
      error: err => {
        console.error('Login failed:', err);
        // Show error message to user
        alert('Invalid email or password');
      }
    });
  }

  // It navigates to the registration page
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
