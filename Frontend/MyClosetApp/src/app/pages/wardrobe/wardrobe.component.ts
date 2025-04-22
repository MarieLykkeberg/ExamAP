import { Component, OnInit } from '@angular/core';
import { WardrobeService } from '../../core/wardrobe.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.css'],
  imports: [CommonModule],
})
export class WardrobeComponent implements OnInit {
  groupedItems: { [type: string]: any[] } = {};
  objectKeys = Object.keys;

  constructor(private wardrobeService: WardrobeService) {}

  allItems: any[] = [];

  topsItems: any[] = [];
  bottomItems: any[] = [];
  footwearItems: any[] = [];
  accessoriesItems: any[] = [];
  outerwearItems: any[] = [];

  topsTitle: string = '';
  bottomsTitle: string = '';
  footwearTitle: string = '';
  accessoriesTitle: string = '';
  outerwearTitle: string = '';

  ngOnInit(): void {
    this.loadWardrobe();
  }

  loadWardrobe() {
    forkJoin({
      Items: this.wardrobeService.getItems(),
      Categories: this.wardrobeService.getCategories()
    }).subscribe({
      next: (data) => {
        this.groupedItems = { Items: data.Items };
        this.allItems = data.Items;
        this.topsItems = this.allItems.filter(item => item.categoryId === 1);
        this.bottomItems = this.allItems.filter(item => item.categoryId === 2);
        this.footwearItems = this.allItems.filter(item => item.categoryId === 3);
        this.accessoriesItems = this.allItems.filter(item => item.categoryId === 4);
        this.outerwearItems = this.allItems.filter(item => item.categoryId === 5);

        const categories = data.Categories;
        this.topsTitle = categories.find(c => c.categoryId === 1)?.categoryName || 'Tops';
        this.bottomsTitle = categories.find(c => c.categoryId === 2)?.categoryName || 'Bottoms';
        this.footwearTitle = categories.find(c => c.categoryId === 3)?.categoryName || 'Footwear';
        this.accessoriesTitle = categories.find(c => c.categoryId === 4)?.categoryName || 'Accessories';
        this.outerwearTitle = categories.find(c => c.categoryId === 5)?.categoryName || 'Outerwear';


  
        const bottomsCategory = data.Categories.find((c: { categoryId: number, categoryName: string }) => c.categoryId === 2);        
        this.bottomsTitle = bottomsCategory ? bottomsCategory.categoryName : 'Bottoms';
        
      },
      error: (err) => console.error('❌ Failed to load wardrobe:', err)
    });
  }
}