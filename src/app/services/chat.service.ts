import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([
    {
      id: "welcome",
      text: "Hello! I'm Dr. Bot, your virtual health assistant. How can I help you today?",
      sender: "doctor",
      timestamp: Date.now(),
    }
  ]);

  public messages$ = this.messagesSubject.asObservable();

  sendMessage(messageText: string): void {
    const currentMessages = this.messagesSubject.value;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: messageText,
      sender: 'user',
      timestamp: Date.now(),
    };

    this.messagesSubject.next([...currentMessages, userMessage]);

    // Get bot response after delay
    setTimeout(() => {
      const botResponse = this.getChatbotResponse(messageText);
      const doctorMessage: ChatMessage = {
        id: `doctor-${Date.now()}`,
        text: botResponse,
        sender: 'doctor',
        timestamp: Date.now(),
      };

      const updatedMessages = this.messagesSubject.value;
      this.messagesSubject.next([...updatedMessages, doctorMessage]);
    }, 1000 + Math.random() * 1000);
  }

  private getChatbotResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("headache") || lowerMessage.includes("head pain")) {
    return "For headaches, I would recommend paracetamol or ibuprofen. Make sure to stay hydrated and rest. If your headache is severe or persistent, please consult a doctor.";
  }

  if (lowerMessage.includes("fever")) {
    return "For fever, paracetamol can help reduce your temperature. Stay hydrated and rest. If your fever is high (above 39°C/102°F) or lasts more than 3 days, please see a doctor.";
  }

  if (lowerMessage.includes("allergy") || lowerMessage.includes("allergic")) {
    return "For allergies, antihistamines like cetirizine or loratadine can help. Avoid known allergens and keep your living space clean. If you experience severe symptoms like difficulty breathing, seek emergency care.";
  }

  if (lowerMessage.includes("heartburn") || lowerMessage.includes("acid reflux") || lowerMessage.includes("acidity")) {
    return "For heartburn or acidity, omeprazole can help reduce stomach acid. Avoid spicy foods, large meals, and eating before bedtime. If symptoms persist, please consult a doctor.";
  }

  if (lowerMessage.includes("sore throat")) {
    return "For a sore throat, warm salt water gargles can help. Paracetamol can relieve the pain. If it's severe or lasts more than a week, you might need antibiotics - please consult a doctor.";
  }

  if (lowerMessage.includes("diarrhea")) {
    return "For diarrhea, loperamide can provide relief. Stay hydrated and consider electrolyte solutions. If it lasts more than 2 days or is accompanied by fever or severe pain, please see a doctor.";
  }

  if (lowerMessage.includes("muscle pain")) {
    return "For muscle pain, ibuprofen or paracetamol can help relieve discomfort. Gentle stretching and rest are also beneficial. If the pain is severe or unexplained, see a doctor.";
  }

  if (lowerMessage.includes("cold") || lowerMessage.includes("cough")) {
    return "For cold or cough symptoms, rest and hydration are key. Paracetamol can help with discomfort, and antihistamines may help with a runny nose. If symptoms worsen or last more than a week, please consult a doctor.";
  }

  if (lowerMessage.includes("high blood pressure") || lowerMessage.includes("hypertension")) {
    return "For high blood pressure, medications like amlodipine or losartan may be prescribed. Lifestyle changes such as reducing salt, exercising, and managing stress are important. Always consult your doctor for proper management.";
  }

  if (lowerMessage.includes("diabetes")) {
    return "For diabetes, medications like metformin are often prescribed, along with lifestyle changes such as healthy eating, regular exercise, and blood sugar monitoring. Always follow your doctor's guidance.";
  }

  if (lowerMessage.includes("skin fungal infection") || lowerMessage.includes("ringworm") || lowerMessage.includes("athlete's foot")) {
    return "For skin fungal infections, antifungal creams like clotrimazole can help. Keep the affected area clean and dry. If it spreads or doesn't improve, see a doctor.";
  }

  if (lowerMessage.includes("bacterial skin infection") || lowerMessage.includes("cellulitis")) {
    return "For bacterial skin infections, antibiotics may be necessary. Keep the area clean and avoid scratching. Seek medical care for proper treatment.";
  }

  if (lowerMessage.includes("nausea") || lowerMessage.includes("vomiting")) {
    return "For nausea and vomiting, antiemetic medications like ondansetron can help. Stay hydrated with small sips of clear fluids. If symptoms persist or worsen, see a doctor.";
  }

  if (lowerMessage.includes("anxiety")) {
    return "For anxiety, relaxation techniques, breathing exercises, and therapy can help. Medications like SSRIs may be prescribed for severe cases. Speak with a mental health professional for guidance.";
  }

  // Greetings
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return "Hello! I'm Dr. Bot, your virtual health assistant. How can I help you today?";
  }

  // Thanks
  if (lowerMessage.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  return "I'm not sure I understand. Could you please provide more details about your symptoms? For medical emergencies, please call emergency services immediately.";
}

  clearMessages(): void {
    this.messagesSubject.next([
      {
        id: "welcome",
        text: "Hello! I'm Dr. Bot, your virtual health assistant. How can I help you today?",
        sender: "doctor",
        timestamp: Date.now(),
      }
    ]);
  }
}