// src/app/pages/profile/profile.component.ts
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule }            from '@angular/forms';
import { CommonModule }           from '@angular/common';

import { AuthService, User }      from '../../core/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: User;
  loading = true;
  errorMsg?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService       // ← use AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.auth.getUserById(id).subscribe({
      next: (u: User) => {
        this.user = u;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  saveProfile() {
    this.auth.updateUser(this.user).subscribe({
      next: () => {
        alert('Profile saved');
        this.router.navigate(['/profile', this.user.userId]);
      },
      error: () => this.errorMsg = 'Save failed'
    });
  }
}