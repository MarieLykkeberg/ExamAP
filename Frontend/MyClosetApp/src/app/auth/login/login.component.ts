import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  login() {
    console.log('Login function called');
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Backend response:', res);
        this.router.navigate(['/wardrobe']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid email or password');
      }
    });
  }


  goToRegister() {
    this.router.navigate(['/register']);
  }
}
