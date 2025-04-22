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

  ngOnInit(): void {
    this.loadWardrobe();
  }

  loadWardrobe() {
    forkJoin({
      Items: this.wardrobeService.getItems(),
      // Bottoms: this.wardrobeService.getBottoms(), // only if implemented
    }).subscribe({
      next: (data) => {
        this.groupedItems = data;
        console.log('✅ Grouped wardrobe:', data);
      },
      error: (err) => console.error('❌ Failed to load wardrobe:', err)
    });
  }
}
