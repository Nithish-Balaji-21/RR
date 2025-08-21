import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  //   templateUrl: './not-found.html',
  // styleUrls: ['./not-found.scss']
   template: ` 
    <!-- Your inline HTML here -->
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="mb-8">
          <mat-icon class="text-medical-600 mb-4" style="font-size: 120px; height: 120px; width: 120px;">
            error_outline
          </mat-icon>
        </div>
        <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 class="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p class="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div class="space-x-4">
          <button mat-raised-button color="primary" routerLink="/">
            <mat-icon class="mr-2">home</mat-icon>
            Go Home
          </button>
          <button mat-stroked-button routerLink="/symptoms">
            <mat-icon class="mr-2">search</mat-icon>
            Check Symptoms
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Your inline CSS here */
    
  .min-h-screen { min-height: 100vh; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .text-center { text-align: center; }
    .bg-gray-50 { background-color: #f9fafb; }
    
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mr-2 { margin-right: 0.5rem; }
    
    .text-6xl { font-size: 4rem; }
    .text-3xl { font-size: 1.875rem; }
    .text-xl { font-size: 1.25rem; }
    
    .font-bold { font-weight: bold; }
    .font-semibold { font-weight: 600; }
    
    .text-gray-900 { color: #111827; }
    .text-gray-700 { color: #374151; }
    .text-gray-600 { color: #4b5563; }
    .text-medical-600 { color: #0284c7; }
    
    .max-w-md { max-width: 28rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    
    .space-x-4 > * + * { margin-left: 1rem; }
  `]
})
export class NotFoundComponent {}