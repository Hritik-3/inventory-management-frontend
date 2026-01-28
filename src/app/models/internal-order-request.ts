import { OrderItem } from "./order-item";


export interface InternalOrderRequest {
  customerId: number;
  priority: string;
  expectedDate: string;
  notes: string;
 
  items: OrderItem[];
}
 