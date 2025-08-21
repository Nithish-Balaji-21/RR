import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
//  templateUrl: './footer.html',
//   styleUrls: ['./footer.scss']
 template: ` 
    <!-- Your inline HTML here -->
     <footer class="bg-medical-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <div class="flex items-center mb-4">
              <mat-icon class="mr-2">local_pharmacy</mat-icon>
              <span class="text-xl font-bold">REMEDY RADAR</span>
            </div>
            <p class="text-gray-300 mb-4">
              Your trusted health companion for symptom checking, medicine recommendations, 
              and quick delivery of healthcare products.
            </p>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a routerLink="/symptoms" class="text-gray-300 hover:text-white">Check Symptoms</a></li>
              <li><a routerLink="/medicines" class="text-gray-300 hover:text-white">Browse Medicines</a></li>
              <li><a routerLink="/chat" class="text-gray-300 hover:text-white">Chat with Doctor</a></li>
              <li><a routerLink="/cart" class="text-gray-300 hover:text-white">Your Cart</a></li>
            </ul>
          </div>
          
          <!-- Account -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Account</h3>
            <ul class="space-y-2">
              <li><a routerLink="/login" class="text-gray-300 hover:text-white">Login</a></li>
              <li><a routerLink="/profile" class="text-gray-300 hover:text-white">Profile</a></li>
            </ul>
          </div>
          
          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <p class="text-gray-300 mb-2">Emergency: 911</p>
            <p class="text-gray-300 mb-2">Support:+91 8610580099</p>
            <p class="text-gray-300">Email: support@remedyradar.com</p>
          </div>
        </div>
        
        <div class="border-t border-medical-700 mt-8 pt-8 text-center">
          <p class="text-gray-300">
            &copy; 2025 Remedy Radar. All rights reserved. 
            <span class="block mt-2 text-sm">
              This is a demo application. Always consult with healthcare professionals for medical advice.
            </span>
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* Your inline CSS here */
        .bg-medical-800 { background-color: #075985; }
    .text-white { color: white; }
    .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
    .max-w-7xl { max-width: 80rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .gap-8 { gap: 2rem; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mr-2 { margin-right: 0.5rem; }
    .text-xl { font-size: 1.25rem; }
    .text-lg { font-size: 1.125rem; }
    .font-bold { font-weight: bold; }
    .font-semibold { font-weight: 600; }
    .text-gray-300 { color: #d1d5db; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .border-t { border-top-width: 1px; }
    .border-medical-700 { border-color: #0369a1; }
    .mt-8 { margin-top: 2rem; }
    .pt-8 { padding-top: 2rem; }
    .text-center { text-align: center; }
    .block { display: block; }
    .mt-2 { margin-top: 0.5rem; }
    .text-sm { font-size: 0.875rem; }

    a:hover {
      color: white;
      text-decoration: none;
    }

    @media (min-width: 640px) {
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    }

    @media (min-width: 768px) {
      .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }

    @media (min-width: 1024px) {
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
    }
  `]
})
export class FooterComponent {}