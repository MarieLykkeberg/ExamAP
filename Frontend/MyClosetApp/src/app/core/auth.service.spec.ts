import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      // providers: [AuthService] // Optional, only needed if not providedIn: 'root'
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // Simple test to check if service exists
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // Simple test to check if service exists
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test successful login
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

  // Test failed login
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

  // Test logout
  it('should clear auth data on logout', () => {
    // First set some data
    localStorage.setItem('authHeader', 'test-header');
    localStorage.setItem('currentUser', JSON.stringify({ userId: 1 }));

    service.logout();

    expect(localStorage.getItem('authHeader')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  // Test registration
  it('should register new user', () => {
    const newUser = { name: 'Chanel', email: 'chanel@coco.com', password: 'chanel' };
    
    service.register(newUser.name, newUser.email, newUser.password).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:5196/api/user/register');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'User registered successfully' });
  });

  // Test successful login
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

  // Test failed login
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

  // Test logout
  it('should clear auth data on logout', () => {
    // First set some data
    localStorage.setItem('authHeader', 'test-header');
    localStorage.setItem('currentUser', JSON.stringify({ userId: 1 }));

    service.logout();

    expect(localStorage.getItem('authHeader')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  // Test registration
  it('should register new user', () => {
    const newUser = { name: 'Chanel', email: 'chanel@coco.com', password: 'chanel' };
    
    service.register(newUser.name, newUser.email, newUser.password).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:5196/api/user/register');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'User registered successfully' });
  });
});
