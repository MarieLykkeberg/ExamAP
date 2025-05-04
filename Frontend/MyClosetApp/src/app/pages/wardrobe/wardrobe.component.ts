// src/app/pages/wardrobe/wardrobe.component.ts

import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { WardrobeService } from '../../core/wardrobe.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Color, Material, Brand, Occasion } from '../../core/wardrobe.service';

@Component({
  selector: 'app-wardrobe',
  standalone: true,
  imports: [CommonModule, RouterModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.css'],
})
export class WardrobeComponent implements OnInit {
  allItems: any[] = [];
  topsItems: any[] = [];
  bottomItems: any[] = [];
  footwearItems: any[] = [];
  accessoriesItems: any[] = [];
  outerwearItems: any[] = [];

  topsTitle = '';
  bottomsTitle = '';
  footwearTitle = '';
  accessoriesTitle = '';
  outerwearTitle = '';

  showOnlyFavorites = false;

  constructor(private wardrobeService: WardrobeService) { }

  ngOnInit(): void {
    this.loadWardrobe();
  }

  showAll() { this.showOnlyFavorites = false; }
  showFavorites() { this.showOnlyFavorites = true; }
  // Available filter options
  availableColors: Color[] = [];
  availableMaterials: Material[] = [];
  availableBrands: Brand[] = [];
  availableOccasions: Occasion[] = [];

  // Selected filters state (using IDs)
  selectedFilters = {
    color: new Set<number>(),
    material: new Set<number>(),
    brand: new Set<number>(),
    occasion: new Set<number>(),
  };

  getFiltered(items: any[]) {
    return this.showOnlyFavorites
      ? items.filter(i => i.isFavorite)
      : items;
  }

  toggleSelection(type: string, id: number) {
    const filterSet = this.selectedFilters[type as keyof typeof this.selectedFilters];
    if (filterSet.has(id)) {
      filterSet.delete(id);
    } else {
      filterSet.add(id);
    }
    this.filterWardrobe();
  }
  
  isSelected(type: string, id: number): boolean {
    return this.selectedFilters[type as keyof typeof this.selectedFilters].has(id);
  }
  
  filterWardrobe() {
    // Apply filter logic explicitly using IDs
    const filteredItems = this.allItems.filter(item =>
      (this.selectedFilters.color.size === 0 || this.selectedFilters.color.has(item.colorId)) &&
      (this.selectedFilters.material.size === 0 || this.selectedFilters.material.has(item.materialId)) &&
      (this.selectedFilters.brand.size === 0 || this.selectedFilters.brand.has(item.brandId)) &&
      (this.selectedFilters.occasion.size === 0 || this.selectedFilters.occasion.has(item.occasionId)) &&
      (!this.showOnlyFavorites || item.isFavorite)
    );
  
    // Update each category explicitly based on the filtered items
    this.topsItems        = filteredItems.filter(i => i.categoryId === 1);
    this.bottomItems      = filteredItems.filter(i => i.categoryId === 2);
    this.footwearItems    = filteredItems.filter(i => i.categoryId === 3);
    this.accessoriesItems = filteredItems.filter(i => i.categoryId === 4);
    this.outerwearItems   = filteredItems.filter(i => i.categoryId === 5);
  }


  private loadWardrobe() {
    forkJoin({
      Items: this.wardrobeService.getItems(),
      Categories: this.wardrobeService.getCategories(),
      Colors: this.wardrobeService.getColors(),
      Materials: this.wardrobeService.getMaterials(),
      Brands: this.wardrobeService.getBrands(),
      Occasions: this.wardrobeService.getOccasions()
    }).subscribe({
      next: ({ Items, Categories, Colors, Materials, Brands, Occasions }) => {
        // Existing logic (no change)
        this.allItems         = Items;
        this.topsItems        = Items.filter(i => i.categoryId === 1);
        this.bottomItems      = Items.filter(i => i.categoryId === 2);
        this.footwearItems    = Items.filter(i => i.categoryId === 3);
        this.accessoriesItems = Items.filter(i => i.categoryId === 4);
        this.outerwearItems   = Items.filter(i => i.categoryId === 5);
  
        this.topsTitle        = this.findName(Categories, 1, 'Tops');
        this.bottomsTitle     = this.findName(Categories, 2, 'Bottoms');
        this.footwearTitle    = this.findName(Categories, 3, 'Footwear');
        this.accessoriesTitle = this.findName(Categories, 4, 'Accessories');
        this.outerwearTitle   = this.findName(Categories, 5, 'Outerwear');
  
        // Explicitly assign filter options
        this.availableColors    = Colors;
        this.availableMaterials = Materials;
        this.availableBrands    = Brands;
        this.availableOccasions = Occasions;
      },
      error: err => console.error('Failed to load wardrobe', err)
    });
  }

  private findName(list: any[], id: number, fallback: string): string {
    return list.find(x => x.categoryId === id)?.categoryName || fallback;
  }
}