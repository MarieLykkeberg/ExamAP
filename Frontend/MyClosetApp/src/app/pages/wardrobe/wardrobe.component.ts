// src/app/pages/wardrobe/wardrobe.component.ts

import { Component, OnInit }      from '@angular/core';
import { CommonModule }            from '@angular/common';
import { RouterModule }            from '@angular/router';
import { forkJoin }                from 'rxjs';
import { WardrobeService }         from '../../core/wardrobe.service';

@Component({
  selector: 'app-wardrobe',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.css'],
})
export class WardrobeComponent implements OnInit {
  allItems: any[]         = [];
  topsItems: any[]        = [];
  bottomItems: any[]      = [];
  footwearItems: any[]    = [];
  accessoriesItems: any[] = [];
  outerwearItems: any[]   = [];

  topsTitle = '';
  bottomsTitle = '';
  footwearTitle = '';
  accessoriesTitle = '';
  outerwearTitle = '';

  showOnlyFavorites = false;

  constructor(private wardrobeService: WardrobeService) {}

  ngOnInit(): void {
    this.loadWardrobe();
  }

  showAll()       { this.showOnlyFavorites = false; }
  showFavorites() { this.showOnlyFavorites = true; }

  getFiltered(items: any[]) {
    return this.showOnlyFavorites
      ? items.filter(i => i.isFavorite)
      : items;
  }

  private loadWardrobe() {
    forkJoin({
      Items:      this.wardrobeService.getItems(),
      Categories: this.wardrobeService.getCategories()
    }).subscribe({
      next: ({ Items, Categories }) => {
        this.allItems        = Items;
        this.topsItems       = Items.filter(i => i.categoryId === 1);
        this.bottomItems     = Items.filter(i => i.categoryId === 2);
        this.footwearItems   = Items.filter(i => i.categoryId === 3);
        this.accessoriesItems= Items.filter(i => i.categoryId === 4);
        this.outerwearItems  = Items.filter(i => i.categoryId === 5);

        this.topsTitle        = this.findName(Categories, 1, 'Tops');
        this.bottomsTitle     = this.findName(Categories, 2, 'Bottoms');
        this.footwearTitle    = this.findName(Categories, 3, 'Footwear');
        this.accessoriesTitle = this.findName(Categories, 4, 'Accessories');
        this.outerwearTitle   = this.findName(Categories, 5, 'Outerwear');
      },
      error: err => console.error('Failed to load wardrobe', err)
    });
  }

  private findName(list: any[], id: number, fallback: string): string {
    return list.find(x => x.categoryId === id)?.categoryName || fallback;
  }
}