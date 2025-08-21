import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { Medicine } from '../../models/medicine.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
 template: ` 
    <!-- Your inline HTML here -->
      <section class="bg-gradient-medical text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Feel Better, Faster
            </h1>
            <p class="text-xl mb-8">
              Enter your symptoms, get medicine recommendations, and have them delivered to your door in minutes.
            </p>
            <div class="space-x-4">
              <button 
                mat-raised-button 
                routerLink="/symptoms" 
                class="bg-white text-medical-700 hover:bg-gray-100"
              >
                Check Symptoms
                <mat-icon class="ml-2">arrow_forward</mat-icon>
              </button>
              <button 
                mat-stroked-button 
                routerLink="/medicines" 
                class="border-white text-white hover:bg-medical-700"
              >
                Browse Medicines
              </button>
            </div>
          </div>
          <div class="hidden md:block text-center">
            <mat-icon class="text-white" style="font-size: 300px; height: 300px; width: 300px;">
              local_pharmacy
            </mat-icon>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <mat-card class="p-8 text-center">
            <div class="bg-medical-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
              <mat-icon class="text-medical-600 text-4xl">search</mat-icon>
            </div>
            <mat-card-title class="text-xl font-semibold mb-2">Describe Your Symptoms</mat-card-title>
            <mat-card-content class="text-gray-600">
              Tell us how you're feeling and we'll help identify what might be causing your symptoms.
            </mat-card-content>
          </mat-card>
          
          <mat-card class="p-8 text-center">
            <div class="bg-medical-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
              <mat-icon class="text-medical-600 text-4xl">shopping_bag</mat-icon>
            </div>
            <mat-card-title class="text-xl font-semibold mb-2">Get Medicine Recommendations</mat-card-title>
            <mat-card-content class="text-gray-600">
              We'll suggest the right over-the-counter medicines based on your symptoms.
            </mat-card-content>
          </mat-card>
          
          <mat-card class="p-8 text-center">
            <div class="bg-medical-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
              <mat-icon class="text-medical-600 text-4xl">chat</mat-icon>
            </div>
            <mat-card-title class="text-xl font-semibold mb-2">Chat with Our Doctor Bot</mat-card-title>
            <mat-card-content class="text-gray-600">
              Have questions? Chat with our AI doctor for additional guidance and information.
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>
    
    <!-- Popular Medicines Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Popular Medicines</h2>
          <button mat-stroked-button routerLink="/medicines">
            View All
            <mat-icon class="ml-2">arrow_forward</mat-icon>
          </button>
        </div>
        
        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center items-center py-12">
          <mat-spinner diameter="50"></mat-spinner>
        </div>

        <!-- Error State -->
        <div *ngIf="!isLoading && error" class="text-center py-12">
          <p class="text-red-600">{{error}}</p>
          <button mat-raised-button color="primary" (click)="reloadData()" class="mt-4">
            Retry
          </button>
        </div>
        
        <!-- Medicines Grid -->
        <div *ngIf="!isLoading && !error" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <mat-card *ngFor="let medicine of popularMedicines; trackBy: trackByMedicineId">
            <div class="h-48 bg-white flex items-center justify-center p-4 overflow-hidden">
              <img [src]="medicine.image" [alt]="medicine.name" 
                   class="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                   onerror="this.src='assets/images/placeholder.svg'; this.onerror=null;"/>
            </div>
            <mat-card-content class="p-4">
              <mat-card-title class="font-semibold text-lg mb-1">{{medicine.name}}</mat-card-title>
              <p class="text-gray-600 text-sm mb-3">{{medicine.description}}</p>
              <div class="flex justify-between items-center">
                <span class="font-bold text-medical-600">{{formatPrice(medicine.price)}}</span>
                <button mat-raised-button color="primary" (click)="addToCart(medicine)">
                  Add to Cart
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="bg-medical-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">Not feeling well?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Check your symptoms, get medicine recommendations, and feel better faster.
        </p>
        <button 
          mat-raised-button 
          routerLink="/symptoms" 
          class="bg-white text-medical-700 hover:bg-gray-100"
        >
          Get Started Now
        </button>
      </div>
    </section>
  `,
  styles: [`
    /* Your inline CSS here */
     .bg-gradient-medical {
      background: linear-gradient(to right, #0284c7, #075985);
    }
    .bg-medical-600 { background-color: #0284c7; }
    .bg-medical-100 { background-color: #e0f2fe; }
    .text-medical-600 { color: #0284c7; }
    .text-medical-700 { color: #0369a1; }
    
    .max-w-7xl { max-width: 80rem; }
    .max-w-2xl { max-width: 42rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
    .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
    .p-4 { padding: 1rem; }
    .p-8 { padding: 2rem; }
    
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .gap-6 { gap: 1.5rem; }
    .gap-8 { gap: 2rem; }
    .items-center { align-items: center; }
    
    .text-center { text-align: center; }
    .text-xl { font-size: 1.25rem; }
    .text-3xl { font-size: 1.875rem; }
    .text-4xl { font-size: 2.25rem; }
    .text-4xl { font-size: 3rem; }
    .font-bold { font-weight: bold; }
    .font-semibold { font-weight: 600; }
    .text-white { color: white; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-12 { margin-bottom: 3rem; }
    .ml-2 { margin-left: 0.5rem; }
    
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .inline-flex { display: inline-flex; }
    
    .rounded-full { border-radius: 9999px; }
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-gray-200 { background-color: #e5e7eb; }
    .border-white { border-color: white; }
    
    .h-48 { height: 12rem; }
    .w-full { width: 100%; }
    .overflow-hidden { overflow: hidden; }
    
    .transition-transform { transition-property: transform; }
    .duration-300 { transition-duration: 300ms; }
    .hover\\:scale-105:hover { transform: scale(1.05); }
    
    img.object-contain {
      object-fit: contain;
      object-position: center;
    }
    .text-lg { font-size: 1.125rem; }
    .text-sm { font-size: 0.875rem; }
    .text-6xl { font-size: 4rem; }
    
    .space-x-4 > * + * { margin-left: 1rem; }
    .hidden { display: none; }
    .tracking-tight { letter-spacing: -0.025em; }
    
    @media (min-width: 640px) {
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    
    @media (min-width: 768px) {
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .md\\:text-5xl { font-size: 3rem; }
      .md\\:block { display: block; }
    }
    
    @media (min-width: 1024px) {
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
      .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
  `]
})
export class HomeComponent implements OnInit {
  popularMedicines: Medicine[] = [];
  isLoading = true; // Start with loading state
  error: string | null = null;

  constructor(
    private dataService: DataService,
    private cartService: CartService
  ) {
    // Try to load data immediately in constructor
    this.loadMedicines().catch(err => {
      console.error('Failed to load medicines in constructor:', err);
    });
  }

  ngOnInit(): void {
    // Ensure data is loaded in ngOnInit as well
    if (this.popularMedicines.length === 0) {
      this.loadMedicines().catch(err => {
        console.error('Failed to load medicines in ngOnInit:', err);
      });
    }
  }

  private async loadMedicines(): Promise<void> {
    if (!this.isLoading) {
      this.isLoading = true;
    }
    this.error = null;
    
    try {
      console.log('Loading medicines...');
      const allMedicines = await this.dataService.getAllMedicines();
      console.log('Loaded medicines:', allMedicines.length);
      
      if (allMedicines.length === 0) {
        throw new Error('No medicines available');
      }
      
      this.popularMedicines = allMedicines.slice(0, 4);
    } catch (error) {
      console.error('Error loading medicines:', error);
      this.error = 'Failed to load medicines. Please try again.';
      this.popularMedicines = [];
    } finally {
      this.isLoading = false;
    }
  }

  addToCart(medicine: Medicine): void {
    this.cartService.addItem(medicine);
  }

  formatPrice(price: number): string {
    return this.dataService.formatIndianPrice(price);
  }

  trackByMedicineId(index: number, medicine: Medicine): string {
    return medicine.id || medicine._id || index.toString();
  }

  // Public method for template
  reloadData(): void {
    this.loadMedicines().catch(err => {
      console.error('Failed to reload medicines:', err);
    });
  }
}