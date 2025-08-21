import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../../services/auth.service';
import { CartService } from '../../../../services/cart.service';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
//  templateUrl: './header.html',
//   styleUrls: ['./header.scss']
 template: ` 
    <!-- Your inline HTML here -->
        <mat-toolbar class="bg-gradient-medical text-white shadow-md">
      <div class="max-w-7xl mx-auto w-full flex justify-between items-center px-4">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <button mat-button routerLink="/" class="text-xl font-bold text-white">
            <mat-icon class="mr-2">local_pharmacy</mat-icon>
            REMEDY RADAR
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center space-x-1">
          <button mat-button routerLink="/symptoms" class="text-white">
            <mat-icon class="mr-1">search</mat-icon>
            Check Symptoms
          </button>
          <button mat-button routerLink="/medicines" class="text-white">
            <mat-icon class="mr-1">medication</mat-icon>
            Medicines
          </button>
          <button mat-button routerLink="/chat" class="text-white">
            <mat-icon class="mr-1">chat</mat-icon>
            Chat with Doctor
          </button>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center space-x-2">
          <!-- Cart Button -->
          <button 
            mat-icon-button 
            routerLink="/cart" 
            class="text-white"
            [matBadge]="cartItemCount$ | async" 
            matBadgeColor="warn"
            [matBadgeHidden]="(cartItemCount$ | async) === 0"
          >
            <mat-icon>shopping_cart</mat-icon>
          </button>

          <!-- User Menu -->
          <div *ngIf="currentUser$ | async as user; else loginButton">
            <button mat-button [matMenuTriggerFor]="userMenu" class="text-white">
              <mat-icon class="mr-1">person</mat-icon>
              {{user.name}}
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                Profile
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                Logout
              </button>
            </mat-menu>
          </div>

          <ng-template #loginButton>
            <button mat-button routerLink="/login" class="text-white">
              <mat-icon class="mr-1">login</mat-icon>
              Login
            </button>
          </ng-template>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    /* Your inline CSS here */
     .max-w-7xl { max-width: 80rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .w-full { width: 100%; }
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .items-center { align-items: center; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .mr-1 { margin-right: 0.25rem; }
    .mr-2 { margin-right: 0.5rem; }
    .text-xl { font-size: 1.25rem; }
    .font-bold { font-weight: bold; }
    .text-white { color: white; }
    .hidden { display: none; }
    .space-x-1 > * + * { margin-left: 0.25rem; }
    .space-x-2 > * + * { margin-left: 0.5rem; }
    .shadow-md { 
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); 
    }
    .bg-gradient-medical {
      background: linear-gradient(to right, #0284c7, #075985);
    }
    
    @media (min-width: 768px) {
      .md\\:flex { display: flex; }
    }
  `]
})
export class HeaderComponent {
  currentUser$: Observable<User | null>;
  cartItemCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.cartItemCount$ = new Observable(observer => {
      this.cartService.cartItems$.subscribe(items => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  logout(): void {
    this.authService.logout();
  }
}