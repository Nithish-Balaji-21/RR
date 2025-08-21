import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  constructor(private dataService: DataService) {}

  async initialize(): Promise<void> {
    try {
      // Pre-fetch and cache common data
      const [symptoms, medicines] = await Promise.all([
        this.dataService.getAllSymptoms(),
        this.dataService.getAllMedicines()
      ]);
      
      // Force cache update
      await this.dataService.refreshCache(symptoms, medicines);
      
      console.log('App initialization complete:', {
        symptomsLoaded: symptoms.length,
        medicinesLoaded: medicines.length
      });
    } catch (error) {
      console.error('Error initializing app:', error);
      throw error; // Re-throw to prevent app from initializing if data loading fails
    }
  }
}
