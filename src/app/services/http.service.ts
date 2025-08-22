import { Injectable,Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface HttpOptions {
  headers?: { [key: string]: string };
  params?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

 // private baseURL = 'http://localhost:5000/api';
  private baseURL ='https://remedy-radar.onrender.com/api';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  private async isServerAvailable(): Promise<boolean> {
    try {
      const healthUrl = `${this.baseURL}/health`;
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        console.error(`Health check failed: ${response.status} ${response.statusText}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }  private getAuthHeaders(): { [key: string]: string } {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    };

    try {
      if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    
    return headers;
  }



  async get<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers
    };

    console.log(`[HTTP] GET ${url}`);

    try {
      // Add a health check first
      if (!await this.isServerAvailable()) {
        throw new Error('Server is not available. Please ensure the backend server is running.');
      }

      console.log(`Fetching from: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers,
        // Add these options to help with CORS and credentials
        mode: 'cors',
        credentials: 'same-origin'
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          error: `Server returned ${response.status} ${response.statusText}` 
        }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Response from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any, options: HttpOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  async put<T>(endpoint: string, data: any, options: HttpOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  async delete<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }
}
