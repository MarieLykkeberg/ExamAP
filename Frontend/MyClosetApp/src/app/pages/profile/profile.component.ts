// src/app/pages/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule }      from '@angular/common';

import { AuthService, User } from '../../core/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = { userId: 0, name: '', email: '', password: '' };
  errorMsg?: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe({
      next: u => (this.user = u),
      error: () => this.router.navigate(['/login'])
    });
  }

  saveProfile(form: NgForm): void {
    if (form.invalid) return;
    this.auth.updateUser(this.user).subscribe({
      next: () => this.router.navigate(['/wardrobe']),
      error: () => (this.errorMsg = 'Save failed. Please try again.')
    });
  }

  deleteAccount(): void {
    if (!confirm('Are you sure you want to delete your account?')) return;
    this.auth.deleteAccount(this.user.userId).subscribe({
      next: () => {
        this.auth.logout();
        this.router.navigate(['/login']);
      },
      error: () => (this.errorMsg = 'Delete failed. Please try again.')
    });
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
