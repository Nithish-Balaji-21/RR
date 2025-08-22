import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: ` <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl font-bold mb-8">Your Cart</h1>
      
      <!-- Empty Cart State -->
      <div *ngIf="(cartItems$ | async)?.length === 0" class="text-center py-16">
        <mat-icon class="mx-auto h-16 w-16 text-gray-400 mb-4" style="font-size: 64px; height: 64px; width: 64px;">
          shopping_bag
        </mat-icon>
        <h2 class="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p class="text-gray-600 mb-8">Add some medicines to get started.</p>
        <button mat-raised-button color="primary" routerLink="/medicines">
          Browse Medicines
        </button>
      </div>

      <!-- Cart Items -->
      <div *ngIf="(cartItems$ | async)?.length! > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <mat-card class="overflow-hidden">
            <mat-card-header>
              <mat-card-title>Cart Items</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-6">
              <div class="divide-y divide-gray-200">
                <div *ngFor="let item of cartItems$ | async; trackBy: trackByItemId" 
                     class="py-4 flex flex-col sm:flex-row">
                   <div class="h-48 bg-gray-200 flex items-center justify-center p-4">
              <mat-icon class="text-gray-500 text-6xl">medication</mat-icon>
            </div>
                  <div class="flex-grow">
                    <h3 class="font-medium">{{item.medicine.name}}</h3>
                    <p class="text-sm text-gray-600">{{item.medicine.dosage}}</p>
                    <p class="font-medium text-medical-600 mt-1">
                      {{formatPrice(item.medicine.price)}}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2 mt-4 sm:mt-0">
                    <button 
                      mat-icon-button 
                      (click)="decreaseQuantity(item.medicine.id || item.medicine._id || '', item.quantity)"
                      class="h-8 w-8"
                    >
                      <mat-icon>remove_circle_outline</mat-icon>
                    </button>
                    <span class="w-8 text-center">{{item.quantity}}</span>
                    <button 
                      mat-icon-button 
                      (click)="increaseQuantity(item.medicine.id || item.medicine._id || '', item.quantity)"
                      class="h-8 w-8"
                    >
                      <mat-icon>add_circle_outline</mat-icon>
                    </button>
                    <button 
                      mat-icon-button 
                      (click)="removeItem(item.medicine.id || item.medicine._id || '')"
                      class="h-8 w-8 ml-2"
                      color="warn"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        
        <!-- Order Summary -->
        <div>
          <mat-card class="sticky top-4">
            <mat-card-header>
              <mat-card-title>Order Summary</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-6">
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal</span>
                  <span>{{formatPrice(getTotalPrice())}}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Delivery Fee</span>
                  <span>₹49.00</span>
                </div>
                <div class="border-t border-gray-200 pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{{formatPrice(getTotalPrice() + 49.00)}}</span>
                </div>
                
                <div class="pt-4">
                  <mat-form-field class="w-full mb-4">
                    <mat-label>Delivery Address</mat-label>
                    <input 
                      matInput 
                      [(ngModel)]="address" 
                      placeholder="Enter your full address"
                    />
                  </mat-form-field>
                  
                  <button 
                    mat-raised-button 
                    color="primary"
                    class="w-full" 
                    (click)="checkout()"
                    [disabled]="isCheckingOut"
                  >
                    <span *ngIf="!isCheckingOut">Checkout</span>
                    <span *ngIf="isCheckingOut">Processing Order...</span>
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>`,
  styles: [`
    .max-w-7xl { max-width: 80rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
    .p-6 { padding: 1.5rem; }
    .pt-4 { padding-top: 1rem; }
    
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-4 { margin-top: 1rem; }
    .mr-4 { margin-right: 1rem; }
    .ml-2 { margin-left: 0.5rem; }
    
    .text-3xl { font-size: 1.875rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-sm { font-size: 0.875rem; }
    
    .font-bold { font-weight: bold; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    
    .text-center { text-align: center; }
    .text-gray-400 { color: #9ca3af; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-medical-600 { color: #0284c7; }
    
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .gap-8 { gap: 2rem; }
    
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-grow { flex-grow: 1; }
    .flex-shrink-0 { flex-shrink: 0; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    
    .w-8 { width: 2rem; }
    .w-20 { width: 5rem; }
    .w-full { width: 100%; }
    .h-8 { height: 2rem; }
    .h-16 { height: 4rem; }
    .h-20 { height: 5rem; }
    
    .bg-gray-100 { background-color: #f3f4f6; }
    
    .rounded-md { border-radius: 0.375rem; }
    
    .space-x-2 > * + * { margin-left: 0.5rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    
    .divide-y > * + * { border-top: 1px solid #e5e7eb; }
    
    .border-t { border-top-width: 1px; }
    .border-gray-200 { border-color: #e5e7eb; }
    
    .overflow-hidden { overflow: hidden; }
    .sticky { position: sticky; }
    .top-4 { top: 1rem; }
    
    @media (min-width: 640px) {
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .sm\\:flex-row { flex-direction: row; }
      .sm\\:mb-0 { margin-bottom: 0; }
      .sm\\:mt-0 { margin-top: 0; }
    }
    
    @media (min-width: 1024px) {
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .lg\\:col-span-2 { grid-column: span 2 / span 2; }
    }
    `]
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  address = '';
  medicine: any;
  isCheckingOut = false;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {}

  increaseQuantity(medicineId: string, currentQuantity: number): void {
    if (medicineId) {
      this.cartService.updateQuantity(medicineId, currentQuantity + 1);
    }
  }

  decreaseQuantity(medicineId: string, currentQuantity: number): void {
    if (!medicineId) return;
    
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(medicineId, currentQuantity - 1);
    } else {
      this.cartService.removeItem(medicineId);
    }
  }

  removeItem(medicineId: string): void {
    if (medicineId) {
      this.cartService.removeItem(medicineId);
    }
  }

  async checkout(): Promise<void> {
    if (!this.address.trim()) {
      this.snackBar.open('Please enter your delivery address.', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.isCheckingOut = true;
    
    try {
      const success = await this.cartService.checkout(this.address);
      if (success) {
        this.address = '';
      }
    } catch (error) {
      console.error('Checkout error:', error);
      this.snackBar.open('Checkout failed. Please try again.', 'Close', {
        duration: 3000,
      });
    } finally {
      this.isCheckingOut = false;
    }
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  trackByItemId(index: number, item: CartItem): string {
    return item.medicine.id || item.medicine._id || index.toString();
  }
}