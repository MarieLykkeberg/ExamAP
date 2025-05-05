// src/app/pages/wardrobe/wardrobe.component.ts

import { Component, OnInit }        from '@angular/core';
import { CommonModule }             from '@angular/common';
import { RouterModule }             from '@angular/router';
import { FormsModule }              from '@angular/forms';
import { forkJoin }                 from 'rxjs';

import {
  WardrobeService,
  Color,
  Material,
  Occasion
} from '../../core/wardrobe.service';

import { MatIconModule }            from '@angular/material/icon';
import { MatButtonModule }          from '@angular/material/button';

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
  styleUrls: ['./wardrobe.component.css'],
})
export class WardrobeComponent implements OnInit {
  allItems         : any[] = [];
  topsItems         : any[] = [];
  bottomItems       : any[] = [];
  footwearItems     : any[] = [];
  accessoriesItems  : any[] = [];
  outerwearItems    : any[] = [];

  topsTitle         = '';
  bottomsTitle      = '';
  footwearTitle     = '';
  accessoriesTitle  = '';
  outerwearTitle    = '';

  showOnlyFavorites = false;

  availableColors   : Color[]    = [];
  availableMaterials: Material[] = [];
  availableOccasions: Occasion[] = [];

  selectedColor    : number | null = null;
  selectedMaterial : number | null = null;
  selectedOccasion : number | null = null;

  constructor(private wardrobeService: WardrobeService) {}

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

  /** Public so it can be called from the template (change)="filterWardrobe()" */
  filterWardrobe(): void {
    const filtered = this.allItems.filter(item =>
      (!this.showOnlyFavorites || item.isFavorite) &&
      (this.selectedColor    == null || item.colorId    === this.selectedColor) &&
      (this.selectedMaterial == null || item.materialId === this.selectedMaterial) &&
      (this.selectedOccasion == null || item.occasionId === this.selectedOccasion)
    );

    this.topsItems        = filtered.filter(i => i.categoryId === 1);
    this.bottomItems      = filtered.filter(i => i.categoryId === 2);
    this.footwearItems    = filtered.filter(i => i.categoryId === 3);
    this.accessoriesItems = filtered.filter(i => i.categoryId === 4);
    this.outerwearItems   = filtered.filter(i => i.categoryId === 5);
  }

  /** Used by *ngFor={{ getFiltered(...) }} to handle "My favorites" toggle */
  getFiltered(items: any[]): any[] {
    return this.showOnlyFavorites
      ? items.filter(i => i.isFavorite)
      : items;
  }

  private loadWardrobe(): void {
    forkJoin({
      Items:      this.wardrobeService.getItems(),
      Categories: this.wardrobeService.getCategories(),
      Colors:     this.wardrobeService.getColors(),
      Materials:  this.wardrobeService.getMaterials(),
      Occasions:  this.wardrobeService.getOccasions()
    }).subscribe({
      next: ({ Items, Categories, Colors, Materials, Occasions }) => {
        this.allItems           = Items;
        this.availableColors    = Colors;
        this.availableMaterials = Materials;
        this.availableOccasions = Occasions;

        this.topsItems         = Items.filter(i => i.categoryId === 1);
        this.bottomItems       = Items.filter(i => i.categoryId === 2);
        this.footwearItems     = Items.filter(i => i.categoryId === 3);
        this.accessoriesItems  = Items.filter(i => i.categoryId === 4);
        this.outerwearItems    = Items.filter(i => i.categoryId === 5);

        this.topsTitle         = this.findName(Categories, 1, 'Tops');
        this.bottomsTitle      = this.findName(Categories, 2, 'Bottoms');
        this.footwearTitle     = this.findName(Categories, 3, 'Footwear');
        this.accessoriesTitle  = this.findName(Categories, 4, 'Accessories');
        this.outerwearTitle    = this.findName(Categories, 5, 'Outerwear');
      },
      error: err => console.error('Failed to load wardrobe', err)
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