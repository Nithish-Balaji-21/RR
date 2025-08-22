import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Medicine } from '../models/medicine.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  private authService = inject(AuthService);

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

  checkout(address: string): Promise<boolean> {
    return new Promise((resolve) => {
      const currentUser = this.authService.getCurrentUser();
      const cartItems = this.cartItemsSubject.value;
      
      if (!currentUser) {
        this.showMessage('Please login to complete your order');
        resolve(false);
        return;
      }

      if (cartItems.length === 0) {
        this.showMessage('Your cart is empty');
        resolve(false);
        return;
      }

      if (!address.trim()) {
        this.showMessage('Please provide a delivery address');
        resolve(false);
        return;
      }

      // Simulate order processing
      setTimeout(() => {
        const totalItems = this.getItemCount();
        const totalPrice = this.formatPrice(this.getTotalPrice());
        
        const successMessage = `🙂 Order Successful! 

Hi ${currentUser.name},
Your order has been placed successfully to ${address}.

Order Details:
- Items: ${totalItems} item(s)
- Total: ${totalPrice}
- Email: ${currentUser.email}

Note: This is for learning purposes only. Your order will not be delivered. 

Thank you for using our app! 😊`;

        this.showOrderSuccessMessage(successMessage);
        this.clearCart();
        resolve(true);
      }, 2000); // 2 second delay to simulate processing
    });
  }

  private showOrderSuccessMessage(message: string): void {
    console.log('Order Success:', message);
    
    if (typeof window !== 'undefined') {
      // Create backdrop overlay
      const backdrop = document.createElement('div');
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        backdrop-filter: blur(4px);
      `;
      
      // Create modal container
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        z-index: 10000;
        max-width: 480px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      `;
      
      // Parse the message to get individual parts
      const lines = message.split('\n').filter(line => line.trim() !== '');
      
      // Extract user name from "Hi [Name],"
      let userName = 'User';
      const hiLine = lines.find(line => line.startsWith('Hi '));
      if (hiLine) {
        userName = hiLine.replace('Hi ', '').replace(',', '').trim();
      }
      
      // Extract address from "Your order has been placed successfully to [address]."
      let address = '';
      const addressLine = lines.find(line => line.includes('Your order has been placed successfully to '));
      if (addressLine) {
        address = addressLine.replace('Your order has been placed successfully to ', '').replace('.', '').trim();
      }
      
      // Extract order details
      let itemsInfo = '';
      let totalInfo = '';
      let emailInfo = '';
      
      const itemsLine = lines.find(line => line.startsWith('- Items: '));
      if (itemsLine) {
        itemsInfo = itemsLine.replace('- Items: ', '').trim();
      }
      
      const totalLine = lines.find(line => line.startsWith('- Total: '));
      if (totalLine) {
        totalInfo = totalLine.replace('- Total: ', '').trim();
      }
      
      const emailLine = lines.find(line => line.startsWith('- Email: '));
      if (emailLine) {
        emailInfo = emailLine.replace('- Email: ', '').trim();
      }
      
      modal.innerHTML = `
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 24px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
          <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 28px;">
            ✅
          </div>
          <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Order Successful!</h2>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Your order has been placed successfully</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 24px;">
          <!-- User Greeting -->
          <div style="text-align: center; margin-bottom: 24px;">
            <h3 style="color: #0369a1; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">Hi ${userName}! 👋</h3>
            <p style="color: #64748b; margin: 0; font-size: 14px;">Thank you for your order</p>
          </div>
          
          <!-- Order Details Card -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h4 style="color: #1e293b; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
              📦 Order Details
            </h4>
            
            <div style="space-y: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 14px;">Items:</span>
                <span style="color: #1e293b; font-weight: 500; font-size: 14px;">${itemsInfo}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 14px;">Total Amount:</span>
                <span style="color: #0284c7; font-weight: 600; font-size: 16px;">${totalInfo}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 14px;">Email:</span>
                <span style="color: #1e293b; font-size: 14px;">${emailInfo}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0;">
                <span style="color: #64748b; font-size: 14px;">Address:</span>
                <span style="color: #1e293b; font-size: 14px; text-align: right; max-width: 60%;">${address}</span>
              </div>
            </div>
          </div>
          
          <!-- Learning Notice -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #92400e; margin: 0; font-size: 13px; line-height: 1.4;">
              This is for learning purposes only. Your order will not be delivered.
            </p>
          </div>
          
          <!-- Thank You Message -->
          <div style="text-align: center;">
            <p style="color: #0284c7; font-size: 16px; font-weight: 500; margin: 0;">
              Thank you for using our app! 😊
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center;">
          <button id="closeOrderModal" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            Close
          </button>
        </div>
      `;
      
      document.body.appendChild(backdrop);
      document.body.appendChild(modal);
      
      const removeModal = () => {
        if (document.body.contains(backdrop)) {
          document.body.removeChild(backdrop);
        }
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      };
      
      // Close button event
      const closeBtn = modal.querySelector('#closeOrderModal');
      if (closeBtn) {
        closeBtn.addEventListener('click', removeModal);
        
        // Add hover effect
        closeBtn.addEventListener('mouseenter', (e) => {
          (e.target as HTMLElement).style.transform = 'translateY(-1px)';
          (e.target as HTMLElement).style.boxShadow = '0 6px 8px -2px rgba(0, 0, 0, 0.15)';
        });
        
        closeBtn.addEventListener('mouseleave', (e) => {
          (e.target as HTMLElement).style.transform = 'translateY(0)';
          (e.target as HTMLElement).style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
      }
      
      // Close on backdrop click
      backdrop.addEventListener('click', removeModal);
      
      // Close with Escape key
      const escapeListener = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          removeModal();
          document.removeEventListener('keydown', escapeListener);
        }
      };
      document.addEventListener('keydown', escapeListener);
      
      // Auto remove after 15 seconds
      setTimeout(() => {
        removeModal();
        document.removeEventListener('keydown', escapeListener);
      }, 15000);
    }
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
        background: rgba(10, 14, 11, 1);
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