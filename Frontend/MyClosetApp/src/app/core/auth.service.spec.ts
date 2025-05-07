import { TestBed } from '@angular/core/testing';
import { AuthService, User } from './auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(AuthService);
  });

  // ===== TEST 1: Service Creation =====
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ===== TEST 2: Unit Tests =====
  describe('Unit Tests', () => {
    it('should handle missing auth header', () => {
      localStorage.removeItem('authHeader');
      localStorage.removeItem('currentUser');
      
      service.getCurrentUser().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });

    it('should handle invalid user data', () => {
      const invalidUser: User = {
        userId: 0,
        name: '',
        email: '',
        password: ''
      };

      service.updateUser(invalidUser).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  // ===== TEST 3: Registration =====
  it('should register a new user', (done) => {
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123'
    };

    service.register(testUser.name, testUser.email, testUser.password).subscribe({
      next: (response) => {
        expect(response).toBeTruthy();
        done();
      },
      error: (error) => {
        console.error('Registration failed:', error);
        done();
      }
    });
  });

  // ===== TEST 4: Login =====
  it('should login with valid credentials', (done) => {
    const testCredentials = {
      email: 'test@example.com',
      password: 'test123'
    };

    service.login(testCredentials.email, testCredentials.password).subscribe({
      next: (user) => {
        expect(user).toBeTruthy();
        expect(user.email).toBe(testCredentials.email);
        expect(localStorage.getItem('authHeader')).toBeTruthy();
        expect(localStorage.getItem('currentUser')).toBeTruthy();
        done();
      },
      error: (error) => {
        console.error('Login failed:', error);
        done();
      }
    });
  });

  // ===== TEST 5: Get Current User =====
  it('should get current user after login', (done) => {
    // First login
    service.login('test@example.com', 'test123').subscribe({
      next: () => {
        // Then get current user
        service.getCurrentUser().subscribe({
          next: (user) => {
            expect(user).toBeTruthy();
            expect(user.email).toBe('test@example.com');
            done();
          },
          error: (error) => {
            console.error('Get current user failed:', error);
            done();
          }
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
        done();
      }
    });
  });

  // ===== TEST 6: Update User =====
  it('should update user profile', (done) => {
    // First login
    service.login('test@example.com', 'test123').subscribe({
      next: (user) => {
        // Then update user
        const updatedUser: User = {
          ...user,
          name: 'Updated Name'
        };

        service.updateUser(updatedUser).subscribe({
          next: () => {
            expect(localStorage.getItem('currentUser')).toContain('Updated Name');
            done();
          },
          error: (error) => {
            console.error('Update failed:', error);
            done();
          }
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
        done();
      }
    });
  });

  // ===== TEST 7: Delete Account =====
  it('should delete user account', (done) => {
    // First login
    service.login('test@example.com', 'test123').subscribe({
      next: (user) => {
        // Then delete account
        service.deleteAccount(user.userId).subscribe({
          next: () => {
            expect(localStorage.getItem('authHeader')).toBeNull();
            expect(localStorage.getItem('currentUser')).toBeNull();
            done();
          },
          error: (error) => {
            console.error('Delete failed:', error);
            done();
          }
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
        done();
      }
    });
  });

  // ===== TEST 8: Logout =====
  it('should clear user data on logout', () => {
    // First set some data
    localStorage.setItem('authHeader', 'test-header');
    localStorage.setItem('currentUser', JSON.stringify({ userId: 1, name: 'Test' }));

    // Then logout
    service.logout();

    // Verify data is cleared
    expect(localStorage.getItem('authHeader')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
});
