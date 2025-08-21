import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { Symptom } from '../../models/symptom.model';
import { Medicine } from '../../models/medicine.model';

@Component({
  selector: 'app-symptoms',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
   template: ` 
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Symptom Checker</h1>
        <p class="text-gray-600">
          Select your symptoms below to get personalized medicine recommendations.
        </p>
      </div>
      
      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="flex justify-center py-10">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <!-- Content -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Symptoms Selection -->
        <div class="lg:col-span-1">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Select Your Symptoms</mat-card-title>
              <mat-card-subtitle>Check all that apply</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="space-y-4">
                <div *ngFor="let symptom of symptoms; trackBy: trackBySymptomId" 
                     class="flex items-start space-x-3">
                  <mat-checkbox 
                    [(ngModel)]="symptom.selected"
                    (change)="onSymptomToggle(symptom.id || symptom._id, $event.checked)"
                  ></mat-checkbox>
                  <div class="grid gap-1-5 leading-none">
                    <label class="text-sm font-medium cursor-pointer" 
                           (click)="toggleSymptom(symptom)">
                      {{symptom.name}}
                    </label>
                    <p class="text-sm text-muted-foreground">
                      {{symptom.description}}
                    </p>
                  </div>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions class="flex justify-between gap-4 p-4">
              <button mat-stroked-button (click)="clearSelection()" [disabled]="isChecking">
                Clear Selection
              </button>
              <button 
                mat-raised-button 
                color="primary"
                (click)="checkSymptoms()"
                [disabled]="isChecking || selectedSymptoms.length === 0">
                Check Symptoms
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
        
        <!-- Recommendations -->
        <div class="lg:col-span-2">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Recommended Medicines</mat-card-title>
              <mat-card-subtitle>
                <span *ngIf="hasCheckedSymptoms; else initialMessage">
                  Based on your symptoms, we recommend the following medicines.
                </span>
                <ng-template #initialMessage>
                  Select your symptoms and click "Check Symptoms" to get recommendations.
                </ng-template>
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <!-- Initial State -->
              <div *ngIf="!hasCheckedSymptoms && !isChecking" class="text-center py-8 text-gray-500">
                Your medicine recommendations will appear here
              </div>
              
              <!-- Checking State -->
              <div *ngIf="isChecking" class="flex justify-center py-8">
                <mat-spinner diameter="40"></mat-spinner>
              </div>
              
              <!-- No Results -->
              <div *ngIf="hasCheckedSymptoms && !isChecking && recommendedMedicines.length === 0" 
                   class="text-center py-8 text-gray-500">
                No specific medicines found for your symptoms. Please consult a doctor.
              </div>
              
              <!-- Recommendations List -->
              <div *ngIf="recommendedMedicines.length > 0 && !isChecking" class="space-y-4">
                <!-- Debug info -->
                <div class="text-sm text-gray-500 mb-4">
                  Showing {{recommendedMedicines.length}} medicines
                </div>
                
                <div *ngFor="let medicine of recommendedMedicines; trackBy: trackByMedicineId" 
                     class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div class="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div class="h-20 w-24 sm:h-24 sm:w-32 bg-white flex items-center justify-center p-2 overflow-hidden">
                      <img 
                        [src]="medicine.image" 
                        [alt]="medicine.name" 
                        class="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                        onerror="this.src='assets/images/placeholder.svg'; this.onerror=null;" />
                    </div>
                    <div>
                      <h3 class="font-medium">{{medicine.name}}</h3>
                      <p class="text-sm text-gray-600">{{medicine.description}}</p>
                      <p class="text-sm text-gray-600">Dosage: {{medicine.dosage}}</p>
                      <p class="font-medium text-medical-600 mt-1">{{formatPrice(medicine.price)}}</p>
                    </div>
                  </div>
                  <button 
                    mat-raised-button 
                    color="primary"
                    class="w-full sm:w-auto" 
                    (click)="addToCart(medicine)"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
             </mat-card-content>
            <mat-card-actions *ngIf="recommendedMedicines.length > 0 && !isChecking">
              <button 
                mat-raised-button 
                color="primary"
                class="w-full" 
                (click)="viewCart()"
              >
                View Cart
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .max-w-7xl { max-width: 80rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mr-2 { margin-right: 0.5rem; }
    
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .gap-8 { gap: 2rem; }
    .gap-1-5 { gap: 0.375rem; }
    
    .text-3xl { font-size: 1.875rem; }
    .text-sm { font-size: 0.875rem; }
    .font-bold { font-weight: bold; }
    .font-medium { font-weight: 500; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-500 { color: #6b7280; }
    .text-medical-600 { color: #0284c7; }
    .text-muted-foreground { color: #6b7280; }
    
    .flex { display: flex; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .space-x-3 > * + * { margin-left: 0.75rem; }
    .space-x-4 > * + * { margin-left: 1rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    
    .text-center { text-align: center; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .p-4 { padding: 1rem; }
    .p-2 { padding: 0.5rem; }
    
    .w-24 { width: 6rem; }
    .w-32 { width: 8rem; }
    .h-20 { height: 5rem; }
    .h-24 { height: 6rem; }
    .w-full { width: 100%; }
    
    .max-h-full { max-height: 100%; }
    .max-w-full { max-width: 100%; }
    .object-contain { object-fit: contain; }
    .overflow-hidden { overflow: hidden; }
    
    .transition-transform { transition-property: transform; }
    .duration-300 { transition-duration: 300ms; }
    .hover\\:scale-105:hover { transform: scale(1.05); }
    
    .bg-white { background-color: white; }
    
    .rounded-lg { border-radius: 0.5rem; }
    
    .border { border-width: 1px; }
    .border-gray-200 { border-color: #e5e7eb; }
    
    .leading-none { line-height: 1; }
    .cursor-pointer { cursor: pointer; }
    
    @media (min-width: 640px) {
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .sm\\:flex-row { flex-direction: row; }
      .sm\\:items-center { align-items: center; }
      .sm\\:mb-0 { margin-bottom: 0; }
      .sm\\:w-auto { width: auto; }
      .sm\\:h-24 { height: 6rem; }
      .sm\\:w-32 { width: 8rem; }
    }
    
    @media (min-width: 1024px) {
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .lg\\:col-span-1 { grid-column: span 1 / span 1; }
      .lg\\:col-span-2 { grid-column: span 2 / span 2; }
    }
  `]
})
export class SymptomsComponent implements OnInit {
  symptoms: (Symptom & { selected: boolean })[] = [];
  selectedSymptoms: string[] = [];
  recommendedMedicines: Medicine[] = [];
  hasCheckedSymptoms = false;
  isLoading = true;
  isChecking = false;

  constructor(
    private dataService: DataService,
    private cartService: CartService,
    private router: Router
  ) {
    // Start loading data immediately
    this.loadSymptoms().catch(err => {
      console.error('Failed to load symptoms in constructor:', err);
    });
  }

  private async loadSymptoms(): Promise<void> {
    this.isLoading = true;
    try {
      console.log('Loading symptoms and medicines...');
      const [symptoms, medicines] = await Promise.all([
        this.dataService.getAllSymptoms(),
        this.dataService.getAllMedicines() // Pre-fetch medicines
      ]);
      
      console.log('Loaded symptoms:', symptoms.length);
      this.symptoms = symptoms.map(symptom => ({
        ...symptom,
        selected: false
      }));
    } catch (error) {
      console.error('Error loading symptoms:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async ngOnInit(): Promise<void> {
    // Ensure data is loaded in ngOnInit as well
    if (this.symptoms.length === 0) {
      await this.loadSymptoms();
    }
  }

    async onSymptomToggle(symptomId: string | undefined, checked: boolean) {
    if (!symptomId) return;
    
    // Update selected symptoms array
    if (checked) {
      if (!this.selectedSymptoms.includes(symptomId)) {
        this.selectedSymptoms.push(symptomId);
      }
    } else {
      this.selectedSymptoms = this.selectedSymptoms.filter(id => id !== symptomId);
    }
    
    // Reset recommendations when selection changes
    this.recommendedMedicines = [];
    this.hasCheckedSymptoms = false;
  }

  toggleSymptom(symptom: Symptom & { selected: boolean }): void {
    symptom.selected = !symptom.selected;
    this.onSymptomToggle(symptom.id || symptom._id, symptom.selected);
  }

  async checkSymptoms(): Promise<void> {
    if (this.selectedSymptoms.length === 0) {
      console.log('No symptoms selected');
      return;
    }

    this.isChecking = true;
    
    try {
      console.log('Finding medicines for symptoms:', this.selectedSymptoms);
      
      // Get medicines for all selected symptoms in parallel
      const medicinesPromises = this.selectedSymptoms.map(id => 
        this.dataService.getMedicinesBySymptomId(id)
          .then(medicines => {
            if (!medicines || !Array.isArray(medicines)) {
              console.error('Invalid response for symptom', id, ':', medicines);
              return [];
            }
            return medicines;
          })
          .catch(error => {
            console.error('Error fetching medicines for symptom', id, ':', error);
            return [];
          })
      );
      
      const medicinesLists = await Promise.all(medicinesPromises);
      console.log('Raw medicine lists from backend:', medicinesLists);
      
      if (!medicinesLists.some(list => list.length > 0)) {
        console.log('No medicines found for any symptoms');
        this.recommendedMedicines = [];
        this.hasCheckedSymptoms = true;
        return;
      }
      
      // Create a map to store unique medicines by their ID
      const uniqueMedicines = new Map<string, Medicine>();
      
      // Merge all medicine lists, using Map to automatically handle duplicates
      medicinesLists.flat().forEach(medicine => {
        console.log('Processing medicine:', medicine);
        if (!medicine || typeof medicine !== 'object') {
          console.error('Invalid medicine object:', medicine);
          return;
        }
        
        const id = medicine.id || medicine._id;
        if (id && !uniqueMedicines.has(id)) {
          uniqueMedicines.set(id, medicine);
        }
      });
      
      // Convert map values to array
      this.recommendedMedicines = Array.from(uniqueMedicines.values());
      console.log('Final recommended medicines:', this.recommendedMedicines);

      // Ensure we have all required fields for display
      this.recommendedMedicines = this.recommendedMedicines.filter(medicine => {
        const isValid = medicine && medicine.name && (medicine.id || medicine._id);
        if (!isValid) {
          console.error('Invalid medicine object filtered out:', medicine);
        }
        return isValid;
      });

      // Force change detection
      setTimeout(() => {
        console.log('Display conditions:', {
          hasRecommendations: this.recommendedMedicines.length > 0,
          notChecking: !this.isChecking,
          hasCheckedSymptoms: this.hasCheckedSymptoms,
          totalMedicines: this.recommendedMedicines.length
        });
      }, 0);
      
      console.log(`Found ${this.recommendedMedicines.length} recommended medicines`);
      
      // Ensure state is updated properly
      this.hasCheckedSymptoms = true;
      this.isChecking = false;

      // Debug state
      console.log('Component state after update:', {
        hasCheckedSymptoms: this.hasCheckedSymptoms,
        isChecking: this.isChecking,
        medicinesCount: this.recommendedMedicines.length
      });
      
    } catch (error) {
      console.error('Error getting medicine recommendations:', error);
      this.recommendedMedicines = [];
      this.hasCheckedSymptoms = true;
    } finally {
      this.isChecking = false;
      console.log('Final state:', {
        medicines: this.recommendedMedicines.length,
        hasChecked: this.hasCheckedSymptoms,
        isChecking: this.isChecking
      });
    }
  }

  clearSelection(): void {
    this.symptoms.forEach(symptom => symptom.selected = false);
    this.selectedSymptoms = [];
    this.recommendedMedicines = [];
    this.hasCheckedSymptoms = false;
  }

  addToCart(medicine: Medicine): void {
    this.cartService.addItem(medicine);
  }

  viewCart(): void {
    this.router.navigate(['/cart']);
  }

  formatPrice(price: number): string {
    return this.dataService.formatIndianPrice(price);
  }

  trackBySymptomId(index: number, symptom: Symptom & { selected: boolean }): string {
    return symptom.id || symptom._id || index.toString();
  }

  trackByMedicineId(index: number, medicine: Medicine): string {
    return medicine.id || medicine._id || index.toString();
  }
}