// src/app/pages/add/add.component.ts

import { Component, OnInit }         from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';

import { MatFormFieldModule }        from '@angular/material/form-field';
import { MatInputModule }            from '@angular/material/input';
import { MatSelectModule }           from '@angular/material/select';
import { MatIconModule }             from '@angular/material/icon';
import { MatDatepickerModule }       from '@angular/material/datepicker';
import { MatNativeDateModule }       from '@angular/material/core';

import { CategoryService, Category } from '../../core/category.service';
import { ColorService, Color }       from '../../core/color.service';
import { MaterialService, Material } from '../../core/material.service';
import { BrandService }              from '../../core/brand.service';
import { OccasionService, Occasion } from '../../core/occasion.service';
import { ItemService, Item }         from '../../core/item.service';

@Component({
  standalone: true,
  selector: 'app-add-item',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  categories: Category[] = [];
  colors:     Color[]    = [];
  materials:  Material[] = [];
  occasions:  Occasion[] = [];

  
  itemData: Partial<Item> & { imageUrl: string; brandName?: string } = {
    categoryId:   null,
    colorId:      null,
    materialId:   null,
    brandName:    '',
    occasionId:   null,
    isFavorite:   false,
    purchaseDate: new Date().toISOString().split('T')[0],
    imageUrl:     ''
  };

  constructor(
    private categoryService: CategoryService,
    private colorService:    ColorService,
    private materialService: MaterialService,
    private brandService:    BrandService,
    private occasionService: OccasionService,
    private itemService:     ItemService
  ) {}

  async ngOnInit(): Promise<void> {
    this.categories = await this.categoryService.getCategories();
    this.colors     = await this.colorService.getColors();
    this.materials  = await this.materialService.getMaterials();
    this.occasions  = await this.occasionService.getOccasions();
  }

  onFileSelected(evt: Event) {
    const f = (evt.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => (this.itemData.imageUrl = reader.result as string);
    reader.readAsDataURL(f);
  }

  async addItem(): Promise<void> {
    const payload: Item = {
      ...(this.itemData as Item),
      purchaseDate: this.itemData.purchaseDate as string,
      // use brandName instead of brandId
      brandName:    this.itemData.brandName || ''
    };
    try {
      await this.itemService.addItem(payload);
      alert('Item added successfully!');
    } catch (err) {
      console.error(err);
      alert('Error adding item');
    }
  }
}