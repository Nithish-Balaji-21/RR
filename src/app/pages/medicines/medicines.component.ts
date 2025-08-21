import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Medicine } from '../../models/medicine.model';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
 template: ` 
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Medicines</h1>
        <p class="text-gray-600">
          Browse our range of over-the-counter medicines.
        </p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center py-10">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <!-- Error State -->
      <div *ngIf="!isLoading && error" class="text-center py-10">
        <p class="text-red-600 mb-4">{{error}}</p>
        <button mat-raised-button color="primary" (click)="retryLoad()">
          Retry Loading
        </button>
      </div>

      <!-- Content -->
      <div *ngIf="!isLoading && !error">
        <!-- Personalized Recommendations -->
        <div *ngIf="(currentUser$ | async) && personalizedRecommendations.length > 0" class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-medical-600">
            Recommended for You
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <mat-card *ngFor="let medicine of personalizedRecommendations; trackBy: trackByMedicineId"
                      class="medicine-card recommended">
              <div class="h-40 bg-white flex items-center justify-center p-4 overflow-hidden">
                <img [src]="medicine.image" [alt]="medicine.name" 
                     class="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                     onerror="this.src='assets/images/placeholder.svg'; this.onerror=null;"/>
              </div>
              <mat-card-content class="p-4">
                <div class="bg-medical-100 text-medical-800 text-xs font-semibold inline-block px-2 py-1 rounded mb-2">
                  Recommended
                </div>
                <mat-card-title class="font-medium text-lg mb-1">{{medicine.name}}</mat-card-title>
                <p class="text-sm text-gray-600 mb-2">{{medicine.description}}</p>
                <p class="text-sm text-gray-600 mb-4">Dosage: {{medicine.dosage}}</p>
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

        <!-- Search and Filter -->
        <div class="flex flex-col md:flex-row gap-4 mb-8">
          <mat-form-field class="flex-grow">
            <mat-label>Search medicines...</mat-label>
            <input matInput [(ngModel)]="searchTerm" (input)="onSearchChange()" />
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
          <div class="flex items-center gap-2">
            <mat-icon class="text-gray-500">filter_alt</mat-icon>
            <span class="text-sm text-gray-600">Filter by category:</span>
          </div>
        </div>

        <!-- Medicine Tabs -->
        <mat-tab-group>
          <!-- All Medicines -->
          <mat-tab label="All">
            <div class="pt-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <mat-card *ngFor="let medicine of filteredMedicines; trackBy: trackByMedicineId"
                          class="medicine-card">
                  <div class="h-40 bg-white flex items-center justify-center p-4 overflow-hidden">
                    <img [src]="medicine.image" [alt]="medicine.name" 
                         class="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                         onerror="this.src='assets/images/placeholder.svg'; this.onerror=null;"/>
                  </div>
                  <mat-card-content class="p-4">
                    <mat-card-title class="font-medium text-lg mb-1">{{medicine.name}}</mat-card-title>
                    <p class="text-sm text-gray-600 mb-2">{{medicine.description}}</p>
                    <p class="text-sm text-gray-600 mb-4">Dosage: {{medicine.dosage}}</p>
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-medical-600">{{formatPrice(medicine.price)}}</span>
                      <button mat-raised-button color="primary" (click)="addToCart(medicine)">
                        Add to Cart
                      </button>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
              
              <div *ngIf="filteredMedicines.length === 0" class="text-center py-10">
                <p class="text-gray-500">No medicines found matching your search.</p>
              </div>
            </div>
          </mat-tab>

          <!-- Category Tabs -->
          <mat-tab *ngFor="let category of categories; trackBy: trackByCategoryId" 
                   [label]="getCategoryDisplayName(category)">
            <div class="pt-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <mat-card *ngFor="let medicine of getMedicinesByCategory(category); trackBy: trackByMedicineId"
                          class="medicine-card">
                  <div class="h-40 bg-white flex items-center justify-center p-4 overflow-hidden">
                    <img [src]="medicine.image" [alt]="medicine.name" 
                         class="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                         onerror="this.src='assets/images/placeholder.svg'; this.onerror=null;"/>
                  </div>
                  <mat-card-content class="p-4">
                    <mat-card-title class="font-medium text-lg mb-1">{{medicine.name}}</mat-card-title>
                    <p class="text-sm text-gray-600 mb-2">{{medicine.description}}</p>
                    <p class="text-sm text-gray-600 mb-4">Dosage: {{medicine.dosage}}</p>
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-medical-600">{{formatPrice(medicine.price)}}</span>
                      <button mat-raised-button color="primary" (click)="addToCart(medicine)">
                        Add to Cart
                      </button>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
              
              <div *ngIf="getMedicinesByCategory(category).length === 0" class="text-center py-10">
                <p class="text-gray-500">No medicines found in this category matching your search.</p>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
     .w-full { width: 100%; }
    .overflow-hidden { overflow: hidden; }
    .transition-transform { transition-property: transform; }
    .duration-300 { transition-duration: 300ms; }
    .hover\\:scale-105:hover { transform: scale(1.05); }
    
    img.object-contain {
      object-fit: contain;
      object-position: center;
    }
    
    .max-w-7xl { max-width: 80rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
    .pt-6 { padding-top: 1.5rem; }
    .p-4 { padding: 1rem; }
    
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .gap-2 { gap: 0.5rem; }
    
    .text-xl { font-size: 1.25rem; }
    .text-lg { font-size: 1.125rem; }
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .text-3xl { font-size: 1.875rem; }
    .text-6xl { font-size: 4rem; }
    
    .font-bold { font-weight: bold; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-medical-600 { color: #0284c7; }
    .text-medical-800 { color: #075985; }
    
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-medical-50 { background-color: #f0f9ff; }
    .bg-medical-100 { background-color: #e0f2fe; }
    
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-grow { flex-grow: 1; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    
    .h-40 { height: 10rem; }
    
    .rounded { border-radius: 0.25rem; }
    
    .text-center { text-align: center; }
    .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
    
    .inline-block { display: inline-block; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    
    .medicine-card {
      transition: box-shadow 0.3s ease;
    }
    
    .medicine-card:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    .recommended {
      border: 1px solid #0284c7;
    }
    
    @media (min-width: 640px) {
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    
    @media (min-width: 768px) {
      .md\\:flex-row { flex-direction: row; }
    }
    
    @media (min-width: 1024px) {
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    
    @media (min-width: 1280px) {
      .xl\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
  `]
})
export class MedicinesComponent implements OnInit {
  searchTerm = '';
  medicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  categories: string[] = [];
  personalizedRecommendations: Medicine[] = [];
  currentUser$: Observable<User | null>;
  isLoading = true;
  error: string | null = null;

  private categoryMedicineCache: { [key: string]: Medicine[] } = {};

  constructor(
    private dataService: DataService,
    private cartService: CartService,
    private authService: AuthService
  ) {
    console.log('MedicinesComponent constructor');
    this.currentUser$ = this.authService.currentUser$;
    // Start loading data immediately in constructor
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    if (!this.isLoading) {
      this.isLoading = true;
      this.error = null;
    }

    try {
      console.log('Loading initial medicines data...');
      
      // Load everything in parallel for faster loading
      const [medicines, categories] = await Promise.all([
        this.dataService.getAllMedicines(),
        this.dataService.getCategories()
      ]);

      if (medicines.length === 0) {
        throw new Error('No medicines available');
      }

      console.log(`Loaded ${medicines.length} medicines and ${categories.length} categories`);
      
      this.medicines = medicines;
      this.filteredMedicines = [...medicines];
      this.categories = categories;

      // Load recommendations in parallel with category preloading
      await Promise.all([
        this.getPersonalizedRecommendations(),
        this.preloadCategoryMedicines()
      ]);

    } catch (error) {
      console.error('Error loading initial data:', error);
      this.error = 'Failed to load medicines. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  ngOnInit(): void {
    // If data hasn't loaded in constructor, try again
    if (this.medicines.length === 0 && !this.isLoading) {
      this.loadInitialData();
    }
  }

  // Public method for retry button
  retryLoad(): void {
    this.loadInitialData();
  }

  async onSearchChange(): Promise<void> {
    if (this.searchTerm.trim()) {
      try {
        this.filteredMedicines = await this.dataService.searchMedicines(this.searchTerm);
      } catch (error) {
        console.error('Error searching medicines:', error);
        this.filteredMedicines = [];
      }
    } else {
      this.filteredMedicines = [...this.medicines];
    }
  }

  private async getPersonalizedRecommendations(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.medicalHistory?.length) {
      this.personalizedRecommendations = [];
      return;
    }

    this.personalizedRecommendations = this.medicines.filter(medicine => {
      return currentUser.medicalHistory?.some(condition =>
        medicine.description.toLowerCase().includes(condition.toLowerCase()) ||
        medicine.name.toLowerCase().includes(condition.toLowerCase())
      );
    });
  }

  private async preloadCategoryMedicines(): Promise<void> {
    try {
      for (const category of this.categories) {
        this.categoryMedicineCache[category] = await this.dataService.getMedicinesByCategory(category);
      }
    } catch (error) {
      console.error('Error preloading category medicines:', error);
    }
  }

  getMedicinesByCategory(category: string): Medicine[] {
    const categoryMedicines = this.categoryMedicineCache[category] || [];
    if (this.searchTerm.trim()) {
      return categoryMedicines.filter(medicine =>
        medicine.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        medicine.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    return categoryMedicines;
  }

  getCategoryDisplayName(category: string): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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

  trackByCategoryId(index: number, category: string): string {
    return category;
  }
}