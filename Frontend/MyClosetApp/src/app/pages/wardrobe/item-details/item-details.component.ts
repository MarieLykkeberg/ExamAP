// src/app/pages/wardrobe/item-details/item-details.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../../../core/item.service';
import { CategoryService, Category } from '../../../core/category.service';
import { ColorService, Color } from '../../../core/color.service';
import { MaterialService, Material } from '../../../core/material.service';
import { OccasionService, Occasion } from '../../../core/occasion.service';
import { ItemService } from '../../../core/item.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  // initialize to avoid undefined errors
  item: Item = {
    itemId: 0,
    imageUrl: '',
    categoryId: 0,
    colorId: 0,
    materialId: 0,
    brandName: '',
    occasionId: 0,
    isFavorite: false,
    purchaseDate: ''
  };
  errorMsg?: string;

  // lookup arrays for dropdowns
  categories: Category[] = [];
  colors: Color[] = [];
  materials: Material[] = [];
  occasions: Occasion[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private colorService: ColorService,
    private materialService: MaterialService,
    private occasionService: OccasionService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // load the item
    this.itemService.getItem(id).subscribe({
      next: data => this.item = data,
      error: err => console.error('Could not load item', err)
    });

    // load each lookup list separately
    this.categoryService.getCategories().subscribe({
      next: list => this.categories = list,
      error: err => console.error('Could not load categories', err)
    });

    this.colorService.getColors().subscribe({
      next: list => this.colors = list,
      error: err => console.error('Could not load colors', err)
    });

    this.materialService.getMaterials().subscribe({
      next: list => this.materials = list,
      error: err => console.error('Could not load materials', err)
    });

    this.occasionService.getOccasions().subscribe({
      next: list => this.occasions = list,
      error: err => console.error('Could not load occasions', err)
    });
  }
  save(): void {
    if (!this.item.itemId) {
      this.errorMsg = 'Invalid item ID';
      return;
    }
    this.itemService.updateItem(this.item.itemId, this.item).subscribe({
      next: () => {
        alert('Item saved successfully');
      },
      error: () => this.errorMsg = 'Save failed'
    });
  }

  delete(): void {
    if (!confirm('Delete this item?')) return;
    if (!this.item.itemId) {
      this.errorMsg = 'Invalid item ID';
      return;
    }
    this.itemService.deleteItem(this.item.itemId).subscribe({
      next: () => {
        alert('Item deleted successfully');
        this.router.navigate(['/wardrobe']);
      },
      error: () => this.errorMsg = 'Delete failed'
    });
  }
}