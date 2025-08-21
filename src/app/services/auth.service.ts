import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { HttpService } from './http.service';

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedUser = localStorage.getItem('remedy-radar-user');
      const savedToken = localStorage.getItem('auth-token');
      
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          this.currentUserSubject.next(parsedUser);
          this.isLoggedInSubject.next(true);
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          this.clearStorage();
        }
      }
    }
  }

  private clearStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('remedy-radar-user');
      localStorage.removeItem('auth-token');
    }
  }

  private saveUserToStorage(user: User, token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('remedy-radar-user', JSON.stringify(user));
      localStorage.setItem('auth-token', token);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await this.http.post<LoginResponse>('/login', {
        email,
        password
      });

      const userInfo: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        medicalHistory: response.user.medicalHistory || []
      };

      this.currentUserSubject.next(userInfo);
      this.isLoggedInSubject.next(true);
      this.saveUserToStorage(userInfo, response.token);

      this.showMessage(`Welcome back, ${userInfo.name}!`);
      return true;

    } catch (error) {
      console.error('Login error:', error);
      this.showMessage(error instanceof Error ? error.message : 'Login failed. Please try again.');
      return false;
    }
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      const response = await this.http.post<RegisterResponse>('/register', {
        name,
        email,
        password
      });

      const userInfo: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        medicalHistory: response.user.medicalHistory || []
      };

      this.currentUserSubject.next(userInfo);
      this.isLoggedInSubject.next(true);
      this.saveUserToStorage(userInfo, response.token);

      this.showMessage(`Welcome, ${name}! Your account has been created.`);
      return true;

    } catch (error) {
      console.error('Registration error:', error);
      this.showMessage(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      return false;
    }
  }

  async updateProfile(name: string, medicalHistory: string[]): Promise<boolean> {
    try {
      const response = await this.http.put<User>('/user/profile', {
        name,
        medicalHistory
      });

      const updatedUser: User = {
        id: response.id || response._id,
        name: response.name,
        email: response.email,
        role: response.role,
        medicalHistory: response.medicalHistory || []
      };

      this.currentUserSubject.next(updatedUser);
      
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('remedy-radar-user', JSON.stringify(updatedUser));
      }

      this.showMessage('Profile updated successfully!');
      return true;

    } catch (error) {
      console.error('Profile update error:', error);
      this.showMessage(error instanceof Error ? error.message : 'Profile update failed.');
      return false;
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.clearStorage();
    this.showMessage('You have been successfully logged out.');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  getAuthToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('auth-token');
    }
    return null;
  }

  private showMessage(message: string): void {
    // Simple console message for now, replace with proper snackbar later
    console.log('Auth Message:', message);
    
    // You can also create a simple alert or toast notification
    if (typeof window !== 'undefined') {
      // Create a simple toast notification
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 10000;
        max-width: 300px;
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  }
}