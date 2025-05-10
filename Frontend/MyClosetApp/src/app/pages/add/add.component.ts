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
  // Arrays to store available options for dropdowns
  categories: Category[] = [];
  colors: Color[] = [];
  materials: Material[] = [];
  occasions: Occasion[] = [];

  
  itemData: Item = {
    categoryId: null,
    colorId: null,
    materialId: null,
    brandName: '',
    occasionId: null,
    isFavorite: false,
    purchaseDate: new Date().toISOString().split('T')[0],
    imageUrl: ''
  };

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private colorService: ColorService,
    private materialService: MaterialService,
    private occasionService: OccasionService,
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  
    this.colorService.getColors().subscribe(data => {
      this.colors = data;
    });
  
    this.materialService.getMaterials().subscribe(data => {
      this.materials = data;
    });
  
    this.occasionService.getOccasions().subscribe(data => {
      this.occasions = data;
    });
  }

  onFileSelected(evt: Event) {
    const f = (evt.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => (this.itemData.imageUrl = reader.result as string);
    reader.readAsDataURL(f);
  }

  addItem(): void {
    const payload: Item = {
      ...(this.itemData as Item),
      purchaseDate: this.itemData.purchaseDate as string,
      brandName: this.itemData.brandName || ''
    };

    this.itemService.addItem(payload).subscribe({
      next: () => {
        alert('Item added successfully!');
        // Reset the form
        this.itemData = {
          categoryId: null,
          colorId: null,
          materialId: null,
          brandName: '',
          occasionId: null,
          isFavorite: false,
          purchaseDate: new Date().toISOString().split('T')[0],
          imageUrl: ''
        };
        // Reset the file input if it exists
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error adding item');
      }
    });
  }
}