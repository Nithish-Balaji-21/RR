import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatDividerModule
  ],
  // templateUrl: './profile.html',
  // styleUrls: ['./profile.scss']
   template: ` 
    <!-- Your inline HTML here -->
     <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div *ngIf="currentUser$ | async as user">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">Profile</h1>
          <p class="text-gray-600">Manage your account and preferences</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- User Information -->
          <mat-card>
            <mat-card-header>
              <div mat-card-avatar class="bg-medical-600 text-white flex items-center justify-center">
                <mat-icon>person</mat-icon>
              </div>
              <mat-card-title>{{user.name}}</mat-card-title>
              <mat-card-subtitle>{{user.email}}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <mat-list>
                <mat-list-item>
                  <mat-icon matListItemIcon>badge</mat-icon>
                  <div matListItemTitle>Role</div>
                  <div matListItemLine>{{user.role | titlecase}}</div>
                </mat-list-item>
                <mat-divider></mat-divider>
                <mat-list-item>
                  <mat-icon matListItemIcon>email</mat-icon>
                  <div matListItemTitle>Email</div>
                  <div matListItemLine>{{user.email}}</div>
                </mat-list-item>
                <mat-divider></mat-divider>
                <mat-list-item>
                  <mat-icon matListItemIcon>calendar_today</mat-icon>
                  <div matListItemTitle>Member Since</div>
                  <div matListItemLine>January 2025</div>
                </mat-list-item>
              </mat-list>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">
                <mat-icon class="mr-2">edit</mat-icon>
                Edit Profile
              </button>
            </mat-card-actions>
          </mat-card>

          <!-- Medical History -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Medical History</mat-card-title>
              <mat-card-subtitle>Your recorded medical conditions</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="user.medicalHistory && user.medicalHistory.length > 0; else noHistory">
                <mat-list>
                  <mat-list-item *ngFor="let condition of user.medicalHistory; let last = last">
                    <mat-icon matListItemIcon class="text-medical-600">medical_services</mat-icon>
                    <div matListItemTitle>{{condition}}</div>
                    <mat-divider *ngIf="!last"></mat-divider>
                  </mat-list-item>
                </mat-list>
              </div>
              <ng-template #noHistory>
                <p class="text-gray-500 text-center py-4">
                  No medical history recorded
                </p>
              </ng-template>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">
                <mat-icon class="mr-2">add</mat-icon>
                Add Condition
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- Quick Actions -->
        <mat-card class="mt-8">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button mat-stroked-button class="h-24 flex flex-col items-center justify-center" (click)="navigateToSymptoms()">
                <mat-icon class="mb-2 text-medical-600">search</mat-icon>
                <span>Check Symptoms</span>
              </button>
              <button mat-stroked-button class="h-24 flex flex-col items-center justify-center" (click)="navigateToMedicines()">
                <mat-icon class="mb-2 text-medical-600">medication</mat-icon>
                <span>Browse Medicines</span>
              </button>
              <button mat-stroked-button class="h-24 flex flex-col items-center justify-center" (click)="navigateToChat()">
                <mat-icon class="mb-2 text-medical-600">chat</mat-icon>
                <span>Chat with Doctor</span>
              </button>
              <button mat-stroked-button class="h-24 flex flex-col items-center justify-center" (click)="navigateToCart()">
                <mat-icon class="mb-2 text-medical-600">shopping_cart</mat-icon>
                <span>View Cart</span>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Account Actions -->
        <div class="mt-8 text-center">
          <button mat-raised-button color="warn" (click)="logout()">
            <mat-icon class="mr-2">logout</mat-icon>
            Logout
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Your inline CSS here */
    
    .max-w-4xl { max-width: 56rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mt-8 { margin-top: 2rem; }
    .mr-2 { margin-right: 0.5rem; }
    
    .text-3xl { font-size: 1.875rem; }
    .font-bold { font-weight: bold; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-medical-600 { color: #0284c7; }
    
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .gap-4 { gap: 1rem; }
    .gap-8 { gap: 2rem; }
    
    .bg-medical-600 { background-color: #0284c7; }
    .text-white { color: white; }
    
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    
    .text-center { text-align: center; }
    
    .h-24 { height: 6rem; }
    
    @media (min-width: 640px) {
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    }
    
    @media (min-width: 768px) {
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    
    @media (min-width: 1024px) {
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
    }

  `]
})
export class ProfileComponent implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateToSymptoms(): void {
    this.router.navigate(['/symptoms']);
  }

  navigateToMedicines(): void {
    this.router.navigate(['/medicines']);
  }

  navigateToChat(): void {
    this.router.navigate(['/chat']);
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
}