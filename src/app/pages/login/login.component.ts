import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  // templateUrl: './login.html',
  // styleUrls: ['./login.scss']
   template: ` 
    <!-- Your inline HTML here -->
      <div class="max-w-md mx-auto px-4 py-12">
      <mat-tab-group class="w-full">
        <mat-tab label="Login">
          <div class="pt-6">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Welcome Back</mat-card-title>
                <mat-card-subtitle>
                  Enter your credentials to access your account
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
                  <mat-form-field class="w-full">
                    <mat-label>Email</mat-label>
                    <input 
                      matInput 
                      type="email"
                      formControlName="email"
                      placeholder="johndoe@example.com"
                    />
                    <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                      Email is required
                    </mat-error>
                    <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                      Please enter a valid email address
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field class="w-full">
                    <mat-label>Password</mat-label>
                    <input 
                      matInput 
                      type="password"
                      formControlName="password"
                      placeholder="********"
                    />
                    <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                      Password is required
                    </mat-error>
                    <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                      Password must be at least 8 characters
                    </mat-error>
                  </mat-form-field>
                  
                  <button 
                    type="submit" 
                    mat-raised-button 
                    color="primary"
                    class="w-full" 
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    <mat-spinner *ngIf="isLoading" diameter="20" class="mr-2"></mat-spinner>
                    {{isLoading ? 'Logging in...' : 'Login'}}
                  </button>
                </form>
              </mat-card-content>
              <mat-card-footer class="flex flex-col items-center justify-center space-y-2 p-4">
                <div class="text-sm text-gray-500">
                  <span>Demo credentials: </span>
                  <br />
                  <span class="font-medium">User: user@example.com / password123</span>
                  <br />
                  <span class="font-medium">Admin: admin@example.com / admin123</span>
                </div>
              </mat-card-footer>
            </mat-card>
          </div>
        </mat-tab>
        
        <mat-tab label="Register">
          <div class="pt-6">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Create Account</mat-card-title>
                <mat-card-subtitle>
                  Register to get personalized medicine recommendations
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-4">
                  <mat-form-field class="w-full">
                    <mat-label>Full Name</mat-label>
                    <input 
                      matInput 
                      formControlName="name"
                      placeholder="John Doe"
                    />
                    <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                      Name is required
                    </mat-error>
                    <mat-error *ngIf="registerForm.get('name')?.hasError('minlength')">
                      Name must be at least 2 characters
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field class="w-full">
                    <mat-label>Email</mat-label>
                    <input 
                      matInput 
                      type="email"
                      formControlName="email"
                      placeholder="johndoe@example.com"
                    />
                    <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                      Email is required
                    </mat-error>
                    <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                      Please enter a valid email address
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field class="w-full">
                    <mat-label>Password</mat-label>
                    <input 
                      matInput 
                      type="password"
                      formControlName="password"
                      placeholder="********"
                    />
                    <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                      Password is required
                    </mat-error>
                    <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                      Password must be at least 8 characters
                    </mat-error>
                  </mat-form-field>
                  
                  <mat-form-field class="w-full">
                    <mat-label>Confirm Password</mat-label>
                    <input 
                      matInput 
                      type="password"
                      formControlName="confirmPassword"
                      placeholder="********"
                    />
                    <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                      Please confirm your password
                    </mat-error>
                    <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                      Passwords do not match
                    </mat-error>
                  </mat-form-field>
                  
                  <button 
                    type="submit" 
                    mat-raised-button 
                    color="primary"
                    class="w-full" 
                    [disabled]="registerForm.invalid || isLoading"
                  >
                    <mat-spinner *ngIf="isLoading" diameter="20" class="mr-2"></mat-spinner>
                    {{isLoading ? 'Creating account...' : 'Register'}}
                  </button>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    /* Your inline CSS here */
     .max-w-md { max-width: 28rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .pt-6 { padding-top: 1.5rem; }
    .p-4 { padding: 1rem; }
    
    .w-full { width: 100%; }
    
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    
    .text-sm { font-size: 0.875rem; }
    .text-gray-500 { color: #6b7280; }
    .font-medium { font-weight: 500; }
    
    .mr-2 { margin-right: 0.5rem; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      try {
        const { email, password } = this.loginForm.value;
        const success = await this.authService.login(email, password);
        
        if (success) {
          this.router.navigate(['/profile']);
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      try {
        const { name, email, password } = this.registerForm.value;
        const success = await this.authService.register(name, email, password);
        
        if (success) {
          this.router.navigate(['/profile']);
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}