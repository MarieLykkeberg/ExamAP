import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CategoryService, Category } from '../../core/category.service';
import { ColorService, Color }       from '../../core/color.service';
import { MaterialService, Material } from '../../core/material.service';
import { BrandService, Brand }       from '../../core/brand.service';
import { OccasionService, Occasion } from '../../core/occasion.service';
import { ItemService, Item } from '../../core/item.service';

@Component({
  standalone: true,
  selector: 'app-add-item',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  imports: [FormsModule, CommonModule, MatIconModule, MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,],
})
export class AddComponent implements OnInit {

  categories: Category[] = [];
  colors: Color[] = [];
  materials: Material[] = [];
  brands: Brand[] = [];
  occasions: Occasion[] = [];

  itemData = {
    categoryId: null,
    colorId: null,
    materialId: null,
    brandId: null,
    occasionId: null,
    isFavorite: false,
    purchaseDate: new Date(),
    imageUrl: ''
  };

  constructor(
    private categoryService: CategoryService,
    private colorService: ColorService,
    private materialService: MaterialService,
    private brandService: BrandService,
    private occasionService: OccasionService,
    private itemService: ItemService
  ) {}

  async ngOnInit(): Promise<void> {
    this.categories = await this.categoryService.getCategories();
    console.log("Categories in component:", this.categories);
    this.colors     = await this.colorService.getColors();
    this.materials  = await this.materialService.getMaterials();
    this.brands     = await this.brandService.getBrands();
    this.occasions  = await this.occasionService.getOccasions();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.itemData.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async addItem(): Promise<void> {
    try {
      // ✅ Convert the Date object to a string before sending
      const itemToSend = {
        ...this.itemData,
        purchaseDate: this.itemData.purchaseDate.toISOString().split('T')[0]
      };
  
      console.log("Sending Form Data: ", itemToSend);
      await this.itemService.addItem(itemToSend);
      alert('Item added successfully!');
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Error adding item');
    }
  }
}
