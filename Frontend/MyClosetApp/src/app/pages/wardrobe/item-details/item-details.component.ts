// src/app/pages/wardrobe/item-details/item-details.component.ts

import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';

import {
  WardrobeService,
  Item,
  Category,
  Color,
  Material,
  Occasion
} from '../../../core/wardrobe.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [ CommonModule, RouterModule, FormsModule, MatIconModule, MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  // initialize to avoid undefined errors
  item: Item = {
    itemId:     0,
    imageUrl:   '',
    categoryId: 0,
    colorId:    0,
    materialId: 0,
    brandName:  '',
    occasionId: 0,
    isFavorite: false,
    purchaseDate: ''
  };
  errorMsg?: string;

  // lookup arrays for dropdowns
  categories: Category[] = [];
  colors:     Color[]    = [];
  materials:  Material[] = [];
  occasions:  Occasion[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ws: WardrobeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // load the item
    this.ws.getItemById(id).subscribe({
      next: data => this.item = data,
      error: err => console.error('Could not load item', err)
    });

    // load each lookup list separately
    this.ws.getCategories().subscribe({
      next: list => this.categories = list,
      error: err => console.error('Could not load categories', err)
    });

    this.ws.getColors().subscribe({
      next: list => this.colors = list,
      error: err => console.error('Could not load colors', err)
    });

    this.ws.getMaterials().subscribe({
      next: list => this.materials = list,
      error: err => console.error('Could not load materials', err)
    });

    this.ws.getOccasions().subscribe({
      next: list => this.occasions = list,
      error: err => console.error('Could not load occasions', err)
    });
  }

  save(): void {
    this.ws.updateItem(this.item).subscribe({
      next: () => {
        alert('Item saved successfully');
      },
      error: () => this.errorMsg = 'Save failed'
    });
  }

  delete(): void {
    if (!confirm('Delete this item?')) return;
    this.ws.deleteItem(this.item.itemId).subscribe({
      next: () => this.router.navigate(['/wardrobe']),
      error: () => this.errorMsg = 'Delete failed'
    });
  }
}