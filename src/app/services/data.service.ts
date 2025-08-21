import { Injectable } from '@angular/core';
import { Medicine } from '../models/medicine.model';
import { Symptom } from '../models/symptom.model';
import { User, UserRole } from '../models/user.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cachedSymptoms: Symptom[] | null = null;
  private cachedMedicines: Medicine[] | null = null;

  constructor(private http: HttpService) {}

  // Cache management
  async refreshCache(symptoms: Symptom[], medicines: Medicine[]): Promise<void> {
    this.cachedSymptoms = symptoms;
    this.cachedMedicines = medicines.map(medicine => this.normalizeMedicine(medicine));
  }

  // Medicine methods
  async getAllMedicines(): Promise<Medicine[]> {
    try {
      // Return cache if available
      if (this.cachedMedicines) {
        console.log('Returning cached medicines:', this.cachedMedicines.length);
        return this.cachedMedicines;
      }
      
      console.log('Fetching medicines from API...');
      let retries = 3;
      let lastError: any;
      
      while (retries > 0) {
        try {
          const medicines = await this.http.get<Medicine[]>('/medicines');
          
          if (!Array.isArray(medicines)) {
            console.error('Invalid API response:', medicines);
            throw new Error('Invalid API response format');
          }
          
          // Cache the normalized medicines
          this.cachedMedicines = medicines.map(medicine => this.normalizeMedicine(medicine));
          console.log('Cached medicines:', this.cachedMedicines.length);
          
          return this.cachedMedicines;
        } catch (error) {
          lastError = error;
          retries--;
          if (retries > 0) {
            console.log(`Retrying... ${retries} attempts remaining`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
          }
        }
      }
      
      console.error('Error fetching medicines after all retries:', lastError);
      throw lastError;
    } catch (error) {
      console.error('Error in getAllMedicines:', error);
      throw error;
    }
  }

  async getMedicineById(id: string): Promise<Medicine | null> {
    try {
      const medicine = await this.http.get<Medicine>(`/medicines/${id}`);
      return this.normalizeMedicine(medicine);
    } catch (error) {
      console.error('Error fetching medicine by ID:', error);
      return null;
    }
  }

  async getMedicinesByCategory(category: string): Promise<Medicine[]> {
    try {
      const medicines = await this.http.get<Medicine[]>(`/medicines/category/${category}`);
      return medicines.map(medicine => this.normalizeMedicine(medicine));
    } catch (error) {
      console.error('Error fetching medicines by category:', error);
      return [];
    }
  }

  async getAllSymptoms(): Promise<Symptom[]> {
    try {
      if (this.cachedSymptoms) {
        return this.cachedSymptoms;
      }

      console.log('Fetching symptoms from API...');
      const symptoms = await this.http.get<Symptom[]>('/symptoms');
      console.log('Raw symptoms response:', symptoms);
      this.cachedSymptoms = Array.isArray(symptoms) ? symptoms.map(s => this.normalizeSymptom(s)) : [];
      return this.cachedSymptoms;
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      return [];
    }
  }

  async getMedicinesBySymptomId(symptomId: string): Promise<Medicine[]> {
    try {
      const medicines = await this.http.get<Medicine[]>(`/symptoms/${symptomId}/medicines`);
      return medicines.map(medicine => this.normalizeMedicine(medicine));
    } catch (error) {
      console.error('Error fetching medicines for symptom:', error);
      return [];
    }
  }

  

  async getCategories(): Promise<string[]> {
    try {
      return await this.http.get<string[]>('/categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async searchMedicines(searchTerm: string): Promise<Medicine[]> {
    try {
      const medicines = await this.http.get<Medicine[]>(`/medicines/search/${encodeURIComponent(searchTerm)}`);
      return medicines.map(medicine => this.normalizeMedicine(medicine));
    } catch (error) {
      console.error('Error searching medicines:', error);
      return [];
    }
  }

  // Symptom methods
  // async getAllSymptoms(): Promise<Symptom[]> {
  //   try {
  //     const symptoms = await this.http.get<Symptom[]>('/symptoms');
  //     return symptoms.map(symptom => this.normalizeSymptom(symptom));
  //   } catch (error) {
  //     console.error('Error fetching symptoms:', error);
  //     return [];
  //   }
  // }

  async getSymptomById(id: string): Promise<Symptom | null> {
    try {
      const symptom = await this.http.get<Symptom>(`/symptoms/${id}`);
      return this.normalizeSymptom(symptom);
    } catch (error) {
      console.error('Error fetching symptom by ID:', error);
      return null;
    }
  }

  
  // Admin methods
  async createMedicine(medicine: Omit<Medicine, 'id'>): Promise<Medicine | null> {
    try {
      return await this.http.post<Medicine>('/admin/medicines', medicine);
    } catch (error) {
      console.error('Error creating medicine:', error);
      return null;
    }
  }

  async updateMedicine(id: string, medicine: Partial<Medicine>): Promise<Medicine | null> {
    try {
      return await this.http.put<Medicine>(`/admin/medicines/${id}`, medicine);
    } catch (error) {
      console.error('Error updating medicine:', error);
      return null;
    }
  }

  async deleteMedicine(id: string): Promise<boolean> {
    try {
      await this.http.delete(`/admin/medicines/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting medicine:', error);
      return false;
    }
  }

  // Utility methods
  formatIndianPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  // Legacy method for backward compatibility (now returns empty array since we don't need demo users)
  getDemoUsers(): any[] {
    console.warn('getDemoUsers is deprecated. Authentication now uses real backend API.');
    return [];
  }

  // Health check method
  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await this.http.get<{ status: string }>('/health');
      return response.status === 'OK';
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  // Helper methods to normalize MongoDB objects
  private normalizeMedicine(medicine: any): Medicine {
    return {
      id: medicine._id || medicine.id,
      _id: medicine._id,
      name: medicine.name,
      description: medicine.description,
      price: medicine.price,
      image: medicine.image,
      dosage: medicine.dosage,
      category: medicine.category,
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt
    };
  }

  private normalizeSymptom(symptom: any): Symptom {
    return {
      id: symptom._id || symptom.id,
      _id: symptom._id,
      name: symptom.name,
      description: symptom.description,
      relatedMedicines: symptom.relatedMedicines,
      createdAt: symptom.createdAt,
      updatedAt: symptom.updatedAt
    };
  }
}