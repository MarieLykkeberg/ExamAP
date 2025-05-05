import { Component }       from '@angular/core';
import { Router }          from '@angular/router';
import { FormsModule }     from '@angular/forms';
import { CommonModule }    from '@angular/common';
import { switchMap }       from 'rxjs/operators';
import { AuthService, User } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  register() {
    // Clear any stale credentials
    this.authService.logout();

    this.authService
      .register(this.name, this.email, this.password)
      .pipe(
        // After registering, immediately log in
        switchMap(() => this.authService.login(this.email, this.password))
      )
      .subscribe({
        next: (user: User) => {
          console.log('Registered and logged in as:', user);
          // Now go directly to profile
          this.router.navigate(['/wardrobe']);
        },
        error: (err) => {
          console.error('Registration or login failed:', err);
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}