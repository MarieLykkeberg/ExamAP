import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private router: Router, private authService: AuthService) { }

  register() {
    console.log('Register function called');
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Backend response:', res);
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
