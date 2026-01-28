import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 🔹 add this
import { ReturnOrderFetch } from '../../../models/return-order-fetch.model';
import { ReturnOrderFetchService } from '../../../services/return-order-fetch.service';


@Component({
  selector: 'app-return-order-fetch',
  templateUrl: './return-order-fetch.component.html',
  styleUrls: ['./return-order-fetch.component.css'],
  standalone: true,
  imports: [CommonModule]   // 🔹 add this
})
export class ReturnOrderFetchComponent implements OnInit {
  returnOrders: ReturnOrderFetch[] = [];
  loading = true;
  error: string | null = null;

  constructor(private returnOrderFetchService: ReturnOrderFetchService) {}

  ngOnInit(): void {
    this.loadReturnOrders();
  }

loadReturnOrders(): void {
  this.returnOrderFetchService.getAllReturnOrders().subscribe({
    next: (data) => {
      // sort so latest return orders come first
      this.returnOrders = data.sort(
        (a, b) => new Date(b.roReturnDate).getTime() - new Date(a.roReturnDate).getTime()
      );
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Failed to load return orders';
      console.error(err);
      this.loading = false;
    }
  });
}

}
