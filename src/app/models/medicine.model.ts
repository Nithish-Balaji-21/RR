export interface Medicine {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number; // Price in INR
  image: string;
  dosage: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}