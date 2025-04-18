import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-wardrobe',
  imports: [],
  templateUrl: './wardrobe.component.html',
  styleUrl: './wardrobe.component.css'
})
export class WardrobeComponent {

  constructor(private router: Router) {}

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

}
