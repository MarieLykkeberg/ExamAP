import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  showWardrobeSubnav: boolean = false;

  constructor(
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.updateSubnav(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateSubnav(event.url);
      }
    });
  }

  private updateSubnav(url: string) {
    this.showWardrobeSubnav = url.startsWith('/wardrobe') || url === '/favorites';
  }
}


