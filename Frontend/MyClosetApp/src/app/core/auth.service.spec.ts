import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store auth header after successful login', () => {
    const testUser = { 
      userId: 1, 
      email: 'chanel@coco.com', 
      name: 'Chanel',
      password: 'chanel'
    };
    
    service.login('chanel@coco.com', 'chanel').subscribe(user => {
      expect(user).toEqual(testUser);
      expect(localStorage.getItem('authHeader')).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:5196/api/user/login');
    expect(req.request.method).toBe('POST');
    req.flush(testUser);
  });

  it('should not store auth header after failed login', () => {
    service.login('wrong@example.com', 'wrongpass').subscribe({
      next: () => fail('should have failed with 401 error'),
      error: () => {
        expect(localStorage.getItem('authHeader')).toBeNull();
      }
    });
  
    const req = httpMock.expectOne('http://localhost:5196/api/user/login');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should clear auth data on logout', () => {
    localStorage.setItem('authHeader', 'test-header');
    localStorage.setItem('currentUser', JSON.stringify({ userId: 1 }));

    service.logout();

    expect(localStorage.getItem('authHeader')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should register new user', () => {
    const newUser = { name: 'Chanel', email: 'chanel@coco.com', password: 'chanel' };
    
    service.register(newUser.name, newUser.email, newUser.password).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:5196/api/user/register');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'User registered successfully' });
  });

  // Unit Tests for getCurrentUser()
  describe('getCurrentUser()', () => {
    it('should return the currentUser if already set in memory', () => {
      const testUser = {
        userId: 1,
        name: 'Loewe',
        email: 'loewe@fashion.com',
        password: 'loewe123'
      };

      (service as any).currentUser = testUser;

      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(testUser);
      });
    });

    it('should return the user from localStorage if not set in memory', () => {
      const storedUser = {
        userId: 2,
        name: 'Miu Miu',
        email: 'miumiu@fashion.com',
        password: 'miumiu123'
      };

      localStorage.setItem('currentUser', JSON.stringify(storedUser));
      (service as any).currentUser = null;

      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(storedUser);
      });
    });

    it('should return null if no user is stored in memory or localStorage', () => {
      localStorage.removeItem('currentUser');
      (service as any).currentUser = null;

      service.getCurrentUser().subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });
});