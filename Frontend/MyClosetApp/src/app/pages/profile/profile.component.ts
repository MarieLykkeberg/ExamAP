import { Component, OnInit }      from '@angular/core';
import { Router }                 from '@angular/router';
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
  errorMsg?: string;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const u = this.auth.getCurrentUser();
    if (!u) {
      // not logged in — send back to login
      this.router.navigate(['/login']);
      return;
    }
    // we got our user from AuthService.login()
    this.user = u;
  }

  saveProfile() {
    this.auth.updateUser(this.user).subscribe({
      next: () => {
        alert('Profile saved');
      },
      error: () => {
        this.errorMsg = 'Save failed';
      }
    });
  }
}