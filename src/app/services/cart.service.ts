import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Medicine } from '../models/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const storedCart = localStorage.getItem('remedy-radar-cart');
      if (storedCart) {
        try {
          const cartItems = JSON.parse(storedCart);
          this.cartItemsSubject.next(cartItems);
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
    }
  }

  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('remedy-radar-cart', JSON.stringify(this.cartItemsSubject.value));
    }
  }

  addItem(medicine: Medicine): void {
    const currentItems = this.cartItemsSubject.value;
    const medicineId = medicine.id || medicine._id;
    const existingItem = currentItems.find(item => {
      const itemId = item.medicine.id || item.medicine._id;
      return itemId === medicineId;
    });

    let updatedItems: CartItem[];
    if (existingItem) {
      updatedItems = currentItems.map(item => {
        const itemId = item.medicine.id || item.medicine._id;
        return itemId === medicineId
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      });
    } else {
      updatedItems = [...currentItems, { medicine, quantity: 1 }];
    }

    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();

    this.showMessage(`${medicine.name} added to cart`);
  }

  removeItem(medicineId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => {
      const itemId = item.medicine.id || item.medicine._id;
      return itemId !== medicineId;
    });
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  updateQuantity(medicineId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(medicineId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      const itemId = item.medicine.id || item.medicine._id;
      return itemId === medicineId
        ? { ...item, quantity }
        : item;
    });

    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.medicine.price * item.quantity), 
      0
    );
  }

  getItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity, 
      0
    );
  }

  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  private showMessage(message: string): void {
    // Simple console message for now, replace with proper snackbar later
    console.log('Cart Message:', message);
    
    // Create a simple toast notification
    if (typeof window !== 'undefined') {
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 10000;
        max-width: 300px;
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 2000);
    }
  }
}