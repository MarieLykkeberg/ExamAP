// src/app/pages/wardrobe/wardrobe.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ItemService, Item } from '../../core/item.service';
import { MaterialService, Material } from '../../core/material.service';
import { CategoryService, Category } from '../../core/category.service';
import { ColorService, Color } from '../../core/color.service';
import { OccasionService, Occasion } from '../../core/occasion.service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-wardrobe',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.css']
})
export class WardrobeComponent implements OnInit {
  allItems: Item[] = [];
  topsItems: Item[] = [];
  bottomItems: Item[] = [];
  footwearItems: Item[] = [];
  accessoriesItems: Item[] = [];
  outerwearItems: Item[] = [];

  topsTitle = '';
  bottomsTitle = '';
  footwearTitle = '';
  accessoriesTitle = '';
  outerwearTitle = '';

  showOnlyFavorites = false;

  availableColors   : Color[]    = [];
  availableMaterials: Material[] = [];
  availableOccasions: Occasion[] = [];

  selectedColor    : number | null = null;
  selectedMaterial : number | null = null;
  selectedOccasion : number | null = null;

  constructor(
    private itemService: ItemService,
    private materialService: MaterialService,
    private categoryService: CategoryService,
    private colorService: ColorService,
    private occasionService: OccasionService
  ) {}

  ngOnInit(): void {
    this.loadWardrobe();
  }

  showAll(): void {
    this.showOnlyFavorites = false;
    this.filterWardrobe();
  }

  showFavorites(): void {
    this.showOnlyFavorites = true;
    this.filterWardrobe();
  }

  filterWardrobe(): void {
    const filtered = this.allItems.filter(item =>
      (!this.showOnlyFavorites || item.isFavorite) &&
      (this.selectedColor == null || item.colorId === this.selectedColor) &&
      (this.selectedMaterial == null || item.materialId === this.selectedMaterial) &&
      (this.selectedOccasion == null || item.occasionId === this.selectedOccasion)
    );

    this.topsItems = filtered.filter(i => i.categoryId === 1);
    this.bottomItems = filtered.filter(i => i.categoryId === 2);
    this.footwearItems = filtered.filter(i => i.categoryId === 3);
    this.accessoriesItems = filtered.filter(i => i.categoryId === 4);
    this.outerwearItems = filtered.filter(i => i.categoryId === 5);
  }

  getFiltered(items: Item[]): Item[] {
    return this.showOnlyFavorites
      ? items.filter(i => i.isFavorite)
      : items;
  }

  private loadWardrobe(): void {
    this.itemService.getItems().subscribe(items => {
      this.allItems = items;
      this.topsItems = items.filter(i => i.categoryId === 1);
      this.bottomItems = items.filter(i => i.categoryId === 2);
      this.footwearItems = items.filter(i => i.categoryId === 3);
      this.accessoriesItems = items.filter(i => i.categoryId === 4);
      this.outerwearItems = items.filter(i => i.categoryId === 5);
    });

    this.colorService.getColors().subscribe(colors => this.availableColors = colors);
    this.materialService.getMaterials().subscribe(materials => this.availableMaterials = materials);
    this.occasionService.getOccasions().subscribe(occasions => this.availableOccasions = occasions);
    this.categoryService.getCategories().subscribe(categories => {
      this.topsTitle = this.findName(categories, 1, 'Tops');
      this.bottomsTitle = this.findName(categories, 2, 'Bottoms');
      this.footwearTitle = this.findName(categories, 3, 'Footwear');
      this.accessoriesTitle = this.findName(categories, 4, 'Accessories');
      this.outerwearTitle = this.findName(categories, 5, 'Outerwear');
    });
  }

  private findName(
    list: { categoryId: number; categoryName: string }[],
    id: number,
    fallback: string
  ): string {
    return list.find(x => x.categoryId === id)?.categoryName || fallback;
  }
}