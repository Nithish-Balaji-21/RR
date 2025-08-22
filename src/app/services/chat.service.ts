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

  // Headache variations
  if (lowerMessage.includes("headache") || lowerMessage.includes("head pain") || 
      lowerMessage.includes("migraine") || lowerMessage.includes("head hurts") ||
      lowerMessage.includes("head ache") || lowerMessage.includes("skull pain")) {
    return "For headaches, I would recommend paracetamol or ibuprofen. Make sure to stay hydrated and rest. If your headache is severe or persistent, please consult a doctor.";
  }

  // Fever variations
  if (lowerMessage.includes("fever") || lowerMessage.includes("temperature") ||
      lowerMessage.includes("hot") || lowerMessage.includes("burning up") ||
      lowerMessage.includes("feverish") || lowerMessage.includes("high temp")) {
    return "For fever, paracetamol can help reduce your temperature. Stay hydrated and rest. If your fever is high (above 39°C/102°F) or lasts more than 3 days, please see a doctor.";
  }

  // Allergy variations
  if (lowerMessage.includes("allergy") || lowerMessage.includes("allergic") ||
      lowerMessage.includes("rash") || lowerMessage.includes("itching") ||
      lowerMessage.includes("sneezing") || lowerMessage.includes("runny nose") ||
      lowerMessage.includes("watery eyes") || lowerMessage.includes("hives")) {
    return "For allergies, antihistamines like cetirizine or loratadine can help. Avoid known allergens and keep your living space clean. If you experience severe symptoms like difficulty breathing, seek emergency care.";
  }

  // Heartburn/Acidity variations
  if (lowerMessage.includes("heartburn") || lowerMessage.includes("acid reflux") || 
      lowerMessage.includes("acidity") || lowerMessage.includes("indigestion") ||
      lowerMessage.includes("stomach burn") || lowerMessage.includes("chest burn") ||
      lowerMessage.includes("acid stomach") || lowerMessage.includes("gastric")) {
    return "For heartburn or acidity, omeprazole can help reduce stomach acid. Avoid spicy foods, large meals, and eating before bedtime. If symptoms persist, please consult a doctor.";
  }

  // Sore throat variations
  if (lowerMessage.includes("sore throat") || lowerMessage.includes("throat pain") ||
      lowerMessage.includes("throat hurts") || lowerMessage.includes("scratchy throat") ||
      lowerMessage.includes("throat infection") || lowerMessage.includes("swollen throat")) {
    return "For a sore throat, warm salt water gargles can help. Paracetamol can relieve the pain. If it's severe or lasts more than a week, you might need antibiotics - please consult a doctor.";
  }

  // Diarrhea variations
  if (lowerMessage.includes("diarrhea") || lowerMessage.includes("loose motion") ||
      lowerMessage.includes("loose stools") || lowerMessage.includes("upset stomach") ||
      lowerMessage.includes("stomach upset") || lowerMessage.includes("watery stool")) {
    return "For diarrhea, loperamide can provide relief. Stay hydrated and consider electrolyte solutions. If it lasts more than 2 days or is accompanied by fever or severe pain, please see a doctor.";
  }

  // Joint and muscle pain variations
  if (lowerMessage.includes("knee pain") || lowerMessage.includes("knee hurts") ||
      lowerMessage.includes("joint pain") || lowerMessage.includes("arthritis") ||
      lowerMessage.includes("knee ache") || lowerMessage.includes("knee problem")) {
    return "For knee pain, ibuprofen or paracetamol can help reduce inflammation and pain. Apply ice for acute injuries or heat for chronic pain. Rest and gentle movement are important. If pain persists or is severe, please consult a doctor.";
  }

  if (lowerMessage.includes("muscle pain") || lowerMessage.includes("body pain") ||
      lowerMessage.includes("muscle ache") || lowerMessage.includes("muscle cramp") ||
      lowerMessage.includes("stiff muscles") || lowerMessage.includes("muscle strain")) {
    return "For muscle pain, ibuprofen or paracetamol can help relieve discomfort. Gentle stretching and rest are also beneficial. If the pain is severe or unexplained, see a doctor.";
  }

  // Back pain variations
  if (lowerMessage.includes("back pain") || lowerMessage.includes("backache") ||
      lowerMessage.includes("lower back") || lowerMessage.includes("spine pain") ||
      lowerMessage.includes("back hurts") || lowerMessage.includes("back ache")) {
    return "For back pain, ibuprofen can help reduce inflammation. Apply heat or cold packs, maintain good posture, and do gentle stretching. If pain is severe, radiates to legs, or persists, please see a doctor.";
  }

  // Cold/Cough variations
  if (lowerMessage.includes("cold") || lowerMessage.includes("cough") ||
      lowerMessage.includes("flu") || lowerMessage.includes("congestion") ||
      lowerMessage.includes("blocked nose") || lowerMessage.includes("stuffy nose") ||
      lowerMessage.includes("phlegm") || lowerMessage.includes("mucus")) {
    return "For cold or cough symptoms, rest and hydration are key. Paracetamol can help with discomfort, and antihistamines may help with a runny nose. If symptoms worsen or last more than a week, please consult a doctor.";
  }

  // Blood pressure variations
  if (lowerMessage.includes("high blood pressure") || lowerMessage.includes("hypertension") ||
      lowerMessage.includes("bp high") || lowerMessage.includes("blood pressure") ||
      lowerMessage.includes("high bp") || lowerMessage.includes("pressure high")) {
    return "For high blood pressure, medications like amlodipine or losartan may be prescribed. Lifestyle changes such as reducing salt, exercising, and managing stress are important. Always consult your doctor for proper management.";
  }

  // Diabetes variations
  if (lowerMessage.includes("diabetes") || lowerMessage.includes("blood sugar") ||
      lowerMessage.includes("sugar high") || lowerMessage.includes("diabetic") ||
      lowerMessage.includes("glucose") || lowerMessage.includes("insulin")) {
    return "For diabetes, medications like metformin are often prescribed, along with lifestyle changes such as healthy eating, regular exercise, and blood sugar monitoring. Always follow your doctor's guidance.";
  }

  // Skin conditions variations
  if (lowerMessage.includes("skin fungal infection") || lowerMessage.includes("ringworm") || 
      lowerMessage.includes("athlete's foot") || lowerMessage.includes("fungal infection") ||
      lowerMessage.includes("skin infection") || lowerMessage.includes("itchy skin") ||
      lowerMessage.includes("skin rash")) {
    return "For skin fungal infections, antifungal creams like clotrimazole can help. Keep the affected area clean and dry. If it spreads or doesn't improve, see a doctor.";
  }

  if (lowerMessage.includes("bacterial skin infection") || lowerMessage.includes("cellulitis") ||
      lowerMessage.includes("skin wound") || lowerMessage.includes("cut infection") ||
      lowerMessage.includes("pus") || lowerMessage.includes("infected cut")) {
    return "For bacterial skin infections, antibiotics may be necessary. Keep the area clean and avoid scratching. Seek medical care for proper treatment.";
  }

  // Digestive issues variations
  if (lowerMessage.includes("nausea") || lowerMessage.includes("vomiting") ||
      lowerMessage.includes("throwing up") || lowerMessage.includes("feel sick") ||
      lowerMessage.includes("queasy") || lowerMessage.includes("stomach sick")) {
    return "For nausea and vomiting, antiemetic medications like ondansetron can help. Stay hydrated with small sips of clear fluids. If symptoms persist or worsen, see a doctor.";
  }

  // Constipation variations
  if (lowerMessage.includes("constipation") || lowerMessage.includes("constipated") ||
      lowerMessage.includes("hard stool") || lowerMessage.includes("can't pass stool") ||
      lowerMessage.includes("bowel movement") || lowerMessage.includes("difficulty passing")) {
    return "For constipation, increase fiber intake, drink more water, and exercise regularly. Laxatives like bisacodyl can provide relief. If constipation persists for more than a few days, consult a doctor.";
  }

  // Mental health variations
  if (lowerMessage.includes("anxiety") || lowerMessage.includes("stress") ||
      lowerMessage.includes("panic") || lowerMessage.includes("worried") ||
      lowerMessage.includes("nervous") || lowerMessage.includes("anxious")) {
    return "For anxiety, relaxation techniques, breathing exercises, and therapy can help. Medications like SSRIs may be prescribed for severe cases. Speak with a mental health professional for guidance.";
  }

  if (lowerMessage.includes("depression") || lowerMessage.includes("sad") ||
      lowerMessage.includes("depressed") || lowerMessage.includes("down") ||
      lowerMessage.includes("mood low") || lowerMessage.includes("feeling low")) {
    return "For depression, therapy and counseling are very effective. Regular exercise, social support, and sometimes medications can help. Please consider speaking with a mental health professional for proper support.";
  }

  // Sleep issues variations
  if (lowerMessage.includes("insomnia") || lowerMessage.includes("can't sleep") ||
      lowerMessage.includes("sleepless") || lowerMessage.includes("sleep problem") ||
      lowerMessage.includes("trouble sleeping") || lowerMessage.includes("no sleep")) {
    return "For sleep problems, maintain good sleep hygiene, avoid caffeine late in the day, and create a relaxing bedtime routine. If insomnia persists, consult a doctor as there may be underlying causes.";
  }

  // Eye problems variations
  if (lowerMessage.includes("eye pain") || lowerMessage.includes("eye problem") ||
      lowerMessage.includes("red eyes") || lowerMessage.includes("eye irritation") ||
      lowerMessage.includes("dry eyes") || lowerMessage.includes("eye infection")) {
    return "For eye problems, avoid rubbing your eyes and use preservative-free eye drops for dryness. For infections or persistent pain, see an eye specialist immediately as eye problems can be serious.";
  }

  // Ear problems variations
  if (lowerMessage.includes("ear pain") || lowerMessage.includes("earache") ||
      lowerMessage.includes("ear infection") || lowerMessage.includes("ear problem") ||
      lowerMessage.includes("hearing problem") || lowerMessage.includes("ear hurts")) {
    return "For ear pain, warm compresses can provide relief. Avoid inserting anything into your ear. If you have severe pain, discharge, or hearing loss, see a doctor promptly.";
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