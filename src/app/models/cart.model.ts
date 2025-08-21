import { Medicine } from './medicine.model';

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}