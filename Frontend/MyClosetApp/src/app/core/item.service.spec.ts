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

  // ===== TEST 1: Service Creation =====
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ===== TEST 2: Unit Tests =====
  describe('Unit Tests', () => {
    it('should handle empty items array', async () => {
      // Mock localStorage
      localStorage.setItem('headerValue', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
      
      // Test empty array handling
      const items = await service.getItems();
      expect(Array.isArray(items)).toBeTruthy();
    });

    it('should handle missing auth header', async () => {
      // Clear localStorage
      localStorage.removeItem('headerValue');
      
      // Test missing auth header
      await expectAsync(service.getItems()).toBeRejected();
    });

    it('should handle invalid item data', async () => {
      // Mock localStorage
      localStorage.setItem('headerValue', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
      
      // Test with invalid item data
      const invalidItem = {
        categoryId: null,
        brandName: '',
        purchaseDate: 'invalid-date',
        imageUrl: ''
      } as Item;

      await expectAsync(service.addItem(invalidItem)).toBeRejected();
    });
  });

  // ===== TEST 3: CREATE Operation =====
  it('should create a new item', async () => {
    // 3.1: Setup
    localStorage.setItem('headerValue', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
    
    // 3.2: Test Data
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

    // 3.3: Create Item
    await service.addItem(newItem);
  });

  // ===== TEST 4: READ Operation =====
  it('should retrieve items for current user', async () => {
    // 4.1: Authentication Setup
    localStorage.setItem('headerValue', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
    
    // 4.2: Service Call
    const items = await service.getItems();

    // 4.3: Response Structure Validation
    expect(items).toBeTruthy();
    expect(Array.isArray(items)).toBeTruthy();
    expect(items.length).toBeGreaterThan(0);

    // 4.4: Item Property Validation
    const item = items[0];
    expect(item).toBeTruthy();
    expect(item.itemId).toBeDefined();
    expect(item.brandName).toBeDefined();
    expect(item.imageUrl).toBeDefined();
  });

  // ===== TEST 5: UPDATE Operation =====
  it('should update an existing item', async () => {
    // 5.1: Setup
    localStorage.setItem('headerValue', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
    
    // 5.2: Get existing item
    const items = await service.getItems();
    const itemToUpdate = items[0];
    
    // 5.3: Update item
    const updatedItem: Item = {
      ...itemToUpdate,
      brandName: 'Updated Brand',
      isFavorite: true
    };

    // 5.4: Save changes
    await service.addItem(updatedItem);
  });

  // ===== TEST 6: DELETE Operation =====
  it('should delete an item', async () => {
    // 6.1: Setup
    localStorage.setItem('headerValue', 'Basic dGVzdC51c2VyOlBhc3N3b3JkMTIz');
    
    // 6.2: Get item to delete
    const items = await service.getItems();
    const itemToDelete = items[0];

    // 6.3: Delete item
    if (itemToDelete.itemId) {
      await service.deleteItem(itemToDelete.itemId);
      
      // 6.4: Verify deletion
      const updatedItems = await service.getItems();
      const deletedItem = updatedItems.find(item => item.itemId === itemToDelete.itemId);
      expect(deletedItem).toBeUndefined();
    }
  });
});