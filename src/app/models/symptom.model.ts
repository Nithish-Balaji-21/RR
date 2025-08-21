export interface Symptom {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  relatedMedicines: { id?: string; _id?: string }[]; // Array of medicine references
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}