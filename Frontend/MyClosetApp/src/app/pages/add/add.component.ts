import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-add-item',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  imports: [FormsModule, CommonModule, MatIconModule],
})
export class AddComponent implements OnInit {
  // Explicitly typed arrays
  categories: { categoryId: number, categoryName: string }[] = [];
  colors:     { colorId: number, colorName: string }[]       = [];
  materials:  { materialId: number, materialName: string }[] = [];
  brands:     { brandId: number, brandName: string }[]       = [];
  occasions:  { occasionId: number, occasionName: string }[] = [];

  itemData = {
    userId: 12,
    categoryId:   null,
    colorId:      null,
    materialId:   null,
    brandId:      null,
    occasionId:   null,
    isFavorite:   false,
    purchaseDate: '',
    imageUrl:     ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchColors();
    this.fetchMaterials();
    this.fetchBrands();
    this.fetchOccasions();
  }

  fetchCategories() {
        this.http.get<{ categoryId: number, categoryName: string }[]>('http://localhost:5196/api/category')
          .subscribe(data => this.categories = data);
      }

  fetchColors() {
        this.http.get<{ colorId: number, colorName: string }[]>('http://localhost:5196/api/color')
          .subscribe(data => this.colors = data);
          }

fetchMaterials() {
        this.http.get<{ materialId: number, materialName: string }[]>('http://localhost:5196/api/material')
          .subscribe(data => this.materials = data);
          }

  fetchBrands() {
        this.http.get<{ brandId: number, brandName: string }[]>('http://localhost:5196/api/brand')
          .subscribe(data => this.brands = data);
              }

  fetchOccasions() {
        this.http.get<{ occasionId: number, occasionName: string }[]>('http://localhost:5196/api/occasion')
          .subscribe(data => this.occasions = data);
              }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.itemData.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addItem(): void {
    console.log("Form Data: ", this.itemData);
    this.http.post('http://localhost:5196/api/item', this.itemData)
      .subscribe({
        next: (response) => {
          console.log('Item added successfully', response);
          alert('Item added successfully!');
        },
        error: (err) => {
          console.error('Error adding item:', err);
          alert('Error adding item');
        }
      });
  }
}
