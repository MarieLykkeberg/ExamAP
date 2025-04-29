import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { WardrobeService }   from '../../core/wardrobe.service';
import { forkJoin }          from 'rxjs';

@Component({
  selector: 'app-styling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './styling.component.html',
  styleUrls: ['./styling.component.css']
})
export class StylingComponent implements OnInit {
  // arrays of items 
  topsItems: any[]        = [];
  bottomItems: any[]      = [];
  footwearItems: any[]    = [];
  accessoriesItems: any[] = [];
  outerwearItems: any[]   = [];

  //Indexes into each carosel
  topIndex              = 0;
  bottomIndex           = 0;
  footwearIndex         = 0;
  accessoriesIndexTop    = 0;
  accessoriesIndexBottom = 0;
  outerwearIndex        = 0;

  // titles for each category
  topsTitle        = '';
  bottomsTitle     = '';
  footwearTitle    = '';
  accessoriesTitle = '';
  outerwearTitle   = '';

  constructor(private wardrobeService: WardrobeService) {}

  ngOnInit() {
    forkJoin({
      items: this.wardrobeService.getItems(),
      cats:  this.wardrobeService.getCategories()
    }).subscribe(({ items, cats }) => {
      // splitting it into categories for ech carosel 
      this.topsItems        = items.filter(i => i.categoryId === 1);
      this.bottomItems      = items.filter(i => i.categoryId === 2);
      this.footwearItems    = items.filter(i => i.categoryId === 3);
      this.accessoriesItems = items.filter(i => i.categoryId === 4);
      this.outerwearItems   = items.filter(i => i.categoryId === 5);
      this.randomizeAll();
    });
  }

      // setting the titles for each category (categories removed, but kept if we need later)
      /* this.topsTitle        = cats.find(c => c.categoryId === 1)?.categoryName || 'Tops';
      this.bottomsTitle     = cats.find(c => c.categoryId === 2)?.categoryName || 'Bottoms';
      this.footwearTitle    = cats.find(c => c.categoryId === 3)?.categoryName || 'Footwear';
      this.accessoriesTitle = cats.find(c => c.categoryId === 4)?.categoryName || 'Accessories';
      this.outerwearTitle   = cats.find(c => c.categoryId === 5)?.categoryName || 'Outerwear'; */

      // This is where we set the random index for each category
      generateOutfit() {
        this.randomizeAll();
      }

      // Randomize the indexes for each category
      private randomizeAll() {
      this.topIndex              = this.randomIndex(this.topsItems);
      this.bottomIndex           = this.randomIndex(this.bottomItems);
      this.footwearIndex         = this.randomIndex(this.footwearItems);
      this.accessoriesIndexTop    = this.randomIndex(this.accessoriesItems);
      this.accessoriesIndexBottom = this.randomIndex(this.accessoriesItems);
      this.outerwearIndex        = this.randomIndex(this.outerwearItems);
  }


  // helper to choose the previous or next item in the array + random 

  private prev(arr: any[], idx: number) {
    return idx > 0 ? idx - 1 : arr.length - 1;
  }
  private next(arr: any[], idx: number) {
    return idx < arr.length - 1 ? idx + 1 : 0;
  }

  private randomIndex(arr: any[]): number {
    return arr.length
      ? Math.floor(Math.random() * arr.length)
      : 0;
  }

  prevTop()      { this.topIndex           = this.prev(this.topsItems,        this.topIndex); }
  nextTop()      { this.topIndex           = this.next(this.topsItems,        this.topIndex); }
  prevBottom()   { this.bottomIndex        = this.prev(this.bottomItems,     this.bottomIndex); }
  nextBottom()   { this.bottomIndex        = this.next(this.bottomItems,     this.bottomIndex); }
  prevFootwear() { this.footwearIndex      = this.prev(this.footwearItems,   this.footwearIndex); }
  nextFootwear() { this.footwearIndex      = this.next(this.footwearItems,   this.footwearIndex); }
  prevAccTop()    { this.accessoriesIndexTop    = this.prev(this.accessoriesItems, this.accessoriesIndexTop); }
  nextAccTop()    { this.accessoriesIndexTop    = this.next(this.accessoriesItems, this.accessoriesIndexTop); }
  prevAccBottom() { this.accessoriesIndexBottom = this.prev(this.accessoriesItems, this.accessoriesIndexBottom); }
  nextAccBottom() { this.accessoriesIndexBottom = this.next(this.accessoriesItems, this.accessoriesIndexBottom); }
  prevOuter()    { this.outerwearIndex        = this.prev(this.outerwearItems,   this.outerwearIndex); }
  nextOuter()    { this.outerwearIndex        = this.next(this.outerwearItems,   this.outerwearIndex); }

}