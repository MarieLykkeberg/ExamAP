import { TestBed } from '@angular/core/testing';
import { ItemService, Item } from './item.service';
import { provideHttpClient } from '@angular/common/http';

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ItemService);
  });

  // test service creation 
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

    // test unit tests 
  describe('Unit Tests', () => {
    it('should handle empty items array', () => {
      // Mock localStorage
      localStorage.setItem('authHeader', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
      
      // Test empty array handling
      service.getItems().subscribe(items => {
        expect(Array.isArray(items)).toBeTruthy();
      });
    });

    it('should handle missing auth header', () => {
      // Clear localStorage
      localStorage.removeItem('authHeader');
      
      // Test missing auth header
      service.getItems().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });

    it('should handle invalid item data', () => {
      // Mock localStorage
      localStorage.setItem('authHeader', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
      
      // Test with invalid item data
      const invalidItem = {
        categoryId: null,
        brandName: '',
        purchaseDate: 'invalid-date',
        imageUrl: ''
      } as Item;

      service.addItem(invalidItem).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  // test create operation
  it('should create a new item', () => {
    // Setup
    localStorage.setItem('authHeader', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
    
    // Test Data
    const newItem: Item = {
      categoryId: 1,
      colorId: 1,
      materialId: 1,
      brandName: 'Test Brand',
      occasionId: 1,
      isFavorite: false,
      purchaseDate: '2024-03-20',
      imageUrl: 'test.jpg'
    };

    // Create Item
    service.addItem(newItem).subscribe(item => {
      expect(item).toBeTruthy();
    });
  });

  // test read operation
  it('should retrieve items for current user', () => {
    // Authentication Setup
    localStorage.setItem('authHeader', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
    
    // Service Call
    service.getItems().subscribe(items => {
      // Response Structure Validation
      expect(items).toBeTruthy();
      expect(Array.isArray(items)).toBeTruthy();
      expect(items.length).toBeGreaterThan(0);

      // Item Property Validation
      const item = items[0];
      expect(item).toBeTruthy();
      expect(item.itemId).toBeDefined();
      expect(item.brandName).toBeDefined();
      expect(item.imageUrl).toBeDefined();
    });
  });

  // test update operation
  it('should update an existing item', () => {
    // Setup
    localStorage.setItem('authHeader', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
    
    // Test Data
    const updatedItem: Item = {
      itemId: 1,
      categoryId: 1,
      colorId: 1,
      materialId: 1,
      brandName: 'Updated Brand',
      occasionId: 1,
      isFavorite: true,
      purchaseDate: '2024-03-20',
      imageUrl: 'test.jpg'
    };

    // Update item
    service.updateItem(1, updatedItem).subscribe(item => {
      expect(item).toBeTruthy();
    });
  });

  // test delete operation
  it('should delete an item', () => {
    // Setup
    localStorage.setItem('authHeader', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
    
    // Delete item
    service.deleteItem(1).subscribe(response => {
      expect(response).toBeUndefined();
    });
  });
}); 