import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  //  templateUrl: './layout.html',
  // styleUrls: ['./layout.scss']
   template: ` 
    <!-- Your inline HTML here -->
      <div class="flex flex-col min-h-screen">
      <app-header></app-header>
      <main class="flex-grow">
        <ng-content></ng-content>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    /* Your inline CSS here */
       .flex {
      display: flex;
    }
    .flex-col {
      flex-direction: column;
    }
    .min-h-screen {
      min-height: 100vh;
    }
    .flex-grow {
      flex-grow: 1;
    }
  `]

})
export class LayoutComponent {}