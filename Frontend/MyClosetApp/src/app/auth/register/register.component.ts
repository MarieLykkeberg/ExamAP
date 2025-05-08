import { Component }       from '@angular/core';
import { Router }          from '@angular/router';
import { FormsModule }     from '@angular/forms';
import { CommonModule }    from '@angular/common';
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
    this.authService.register(this.name, this.email, this.password)
      .subscribe({
        next: () => {
          console.log('Registration successful');
          this.router.navigate(['/wardrobe']);
        },
        error: (err) => {
          console.error('Registration failed:', err);
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}