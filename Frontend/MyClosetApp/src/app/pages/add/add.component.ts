// src/app/pages/add/add.component.ts

import { Component, OnInit }                   from '@angular/core';
import { FormsModule }                         from '@angular/forms';
import { CommonModule }                        from '@angular/common';
import { MatIconModule }                       from '@angular/material/icon';
import { MatFormFieldModule }                  from '@angular/material/form-field';
import { MatInputModule }                      from '@angular/material/input';
import { MatDatepickerModule }                 from '@angular/material/datepicker';
import { MatNativeDateModule }                 from '@angular/material/core';
import { MatSelectModule }                     from '@angular/material/select';

import { CategoryService, Category }           from '../../core/category.service';
import { ColorService, Color }                 from '../../core/color.service';
import { MaterialService, Material }           from '../../core/material.service';
import { BrandService, Brand }                 from '../../core/brand.service';
import { OccasionService, Occasion }           from '../../core/occasion.service';
import { ItemService, Item }                   from '../../core/item.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  // Fixed category list
  categories: Category[] = [];

  // Lookups that support inline “+”
  colors:     Color[]    = [];
  materials:  Material[] = [];
  brands:     Brand[]    = [];
  occasions:  Occasion[] = [];

  // Item form data
  itemData: Partial<Item> & { imageUrl: string } = {
    categoryId:   null,
    colorId:      null,
    materialId:   null,
    brandId:      null,
    occasionId:   null,
    isFavorite:   false,
    purchaseDate: new Date().toISOString().split('T')[0],
    imageUrl:     ''
  };

  // Which lookup is showing the inline-add input
  adding: 'color' | 'material' | 'brand' | 'occasion' | null = null;
  newValue = '';

  constructor(
    private categoryService: CategoryService,
    private colorService:    ColorService,
    private materialService: MaterialService,
    private brandService:    BrandService,
    private occasionService: OccasionService,
    private itemService:     ItemService
  ) {}

  async ngOnInit(): Promise<void> {
    // Populate all dropdowns on load
    this.categories = await this.categoryService.getCategories();
    this.colors     = await this.colorService.getColors();
    this.materials  = await this.materialService.getMaterials();
    this.brands     = await this.brandService.getBrands();
    this.occasions  = await this.occasionService.getOccasions();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (this.itemData.imageUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  /** Submit new item to backend */
  async addItem(): Promise<void> {
    const toSend: Item = {
      ...(this.itemData as Item),
      purchaseDate: this.itemData.purchaseDate as string
    };
    try {
      await this.itemService.addItem(toSend);
      alert('Item added successfully!');
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Error adding item');
    }
  }

  /* Show inline add for one of the lookup lists 
  showAdd(kind: 'color'|'material'|'brand'|'occasion') {
    this.adding = kind;
    this.newValue = '';
  }

   Hide inline add without saving 
  cancelAdd() {
    this.adding = null;
  }

  Save new lookup value and refresh that list 
  async addNew(kind: 'color'|'material'|'brand'|'occasion') {
    if (!this.newValue.trim()) return;
    try {
      switch (kind) {
        case 'color':
          await this.colorService.addColor(this.newValue);
          this.colors    = await this.colorService.getColors();
          break;
        case 'material':
          await this.materialService.addMaterial(this.newValue);
          this.materials = await this.materialService.getMaterials();
          break;
        case 'brand':
          await this.brandService.addBrand(this.newValue);
          this.brands    = await this.brandService.getBrands();
          break;
        case 'occasion':
          await this.occasionService.addOccasion(this.newValue);
          this.occasions = await this.occasionService.getOccasions();
          break;
      }
      this.cancelAdd();
    } catch (err) {
      console.error(`Failed to add ${kind}:`, err);
      alert(`Error adding ${kind}`);
    } */
  }
