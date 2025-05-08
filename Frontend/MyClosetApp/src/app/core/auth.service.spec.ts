import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
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
      email: 'test@example.com', 
      name: 'Test User',
      password: 'password123'
    };
    
    service.login('test@example.com', 'password123').subscribe(user => {
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
      error: () => {
        expect(localStorage.getItem('authHeader')).toBeNull();
      }
    });

    const req = httpMock.expectOne('http://localhost:5196/api/user/login');
    req.error(new ErrorEvent('Unauthorized'));
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
    const newUser = { name: 'New User', email: 'new@example.com', password: 'pass123' };
    
    service.register(newUser.name, newUser.email, newUser.password).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:5196/api/user/register');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'User registered successfully' });
  });
});
