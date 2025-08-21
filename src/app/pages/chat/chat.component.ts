import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
   template: ` 
    <!-- Your inline HTML here -->
       <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <mat-card class="overflow-hidden">
        <div class="border-b border-gray-200 p-4 bg-medical-50">
          <div class="flex items-center">
            <div class="h-10 w-10 mr-3 bg-medical-600 rounded-full flex items-center justify-center">
              <mat-icon class="text-white">smart_toy</mat-icon>
            </div>
            <div>
              <h2 class="font-semibold">Dr. Bot</h2>
              <p class="text-sm text-gray-600">AI Health Assistant</p>
            </div>
          </div>
        </div>

        <div 
          #messagesContainer
          class="h-[60vh] overflow-y-auto p-4 bg-gray-50"
        >
          <div class="space-y-4">
            <div *ngFor="let message of messages$ | async; trackBy: trackByMessageId"
                 [class]="'flex ' + (message.sender === 'user' ? 'justify-end' : 'justify-start')">
              <div 
                [class]="'max-w-[75%] rounded-lg p-3 ' + 
                        (message.sender === 'user' 
                          ? 'bg-medical-600 text-white' 
                          : 'bg-white border border-gray-200')"
              >
                <p>{{message.text}}</p>
                <p 
                  [class]="'text-xs mt-1 ' + 
                          (message.sender === 'user' ? 'text-medical-100' : 'text-gray-500')"
                >
                  {{formatTime(message.timestamp)}}
                </p>
              </div>
            </div>
            
            <!-- Typing indicator -->
            <div *ngIf="isTyping" class="flex justify-start">
              <div class="max-w-[75%] rounded-lg p-3 bg-white border border-gray-200">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.1s;"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Input -->
        <div class="border-t border-gray-200 p-4">
          <form (ngSubmit)="sendMessage()" class="flex space-x-2">
            <mat-form-field class="flex-grow">
              <mat-label>Type your symptoms or questions...</mat-label>
              <input 
                matInput 
                [(ngModel)]="newMessage" 
                name="message"
                [disabled]="isTyping"
              />
            </mat-form-field>
            <button 
              type="submit" 
              mat-icon-button 
              color="primary"
              [disabled]="isTyping || !newMessage.trim()"
            >
              <mat-icon>send</mat-icon>
            </button>
          </form>
        </div>
      </mat-card>
      
      <!-- Disclaimer -->
      <mat-card class="mt-6 bg-medical-50">
        <mat-card-content class="p-4">
          <h3 class="font-semibold text-lg mb-2">Important Note</h3>
          <p class="text-sm text-gray-600">
            This chat is powered by an AI assistant and is not a substitute for professional medical advice, 
            diagnosis, or treatment. Always seek the advice of your physician or other qualified health 
            provider with any questions you may have regarding a medical condition.
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    /* Your inline CSS here */
     .max-w-4xl { max-width: 56rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
    .p-4 { padding: 1rem; }
    .p-3 { padding: 0.75rem; }
    
    .h-10 { height: 2.5rem; }
    .w-10 { width: 2.5rem; }
    .w-2 { width: 0.5rem; }
    .h-2 { height: 0.5rem; }
    
    .mr-3 { margin-right: 0.75rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-start { justify-content: flex-start; }
    .justify-end { justify-content: flex-end; }
    
    .bg-medical-50 { background-color: #f0f9ff; }
    .bg-medical-100 { background-color: #e0f2fe; }
    .bg-medical-600 { background-color: #0284c7; }
    .bg-white { background: white; }
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-gray-400 { background-color: #9ca3af; }
    
    .text-white { color: white; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-medical-100 { color: #e0f2fe; }
    
    .font-semibold { font-weight: 600; }
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .text-lg { font-size: 1.125rem; }
    
    .border-b { border-bottom-width: 1px; }
    .border-t { border-top-width: 1px; }
    .border { border-width: 1px; }
    .border-gray-200 { border-color: #e5e7eb; }
    
    .rounded-full { border-radius: 9999px; }
    .rounded-lg { border-radius: 0.5rem; }
    
    .overflow-hidden { overflow: hidden; }
    .overflow-y-auto { overflow-y: auto; }
    
    .h-\\[60vh\\] { height: 60vh; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-x-1 > * + * { margin-left: 0.25rem; }
    .space-x-2 > * + * { margin-left: 0.5rem; }
    
.max-w-\\[75\\%\\] { max-width: 75%; }
    
    .flex-grow { flex-grow: 1; }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
    
    @media (min-width: 640px) {
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    }
    
    @media (min-width: 1024px) {
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messages$: Observable<ChatMessage[]>;
  newMessage = '';
  isTyping = false;

  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.messages$;
  }

  ngOnInit(): void {
    // Subscribe to messages to detect when bot is typing
    this.chatService.messages$.subscribe(() => {
      this.isTyping = false;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    this.isTyping = true;
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }
}