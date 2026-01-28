import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierContactService } from '../../../services/supplier-contact.service';
import { Supplier } from '../../../models/supplier';
import { SupplierRatingService } from '../../../services/supplier-rating.service';

@Component({
  selector: 'app-supplier-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-contact.component.html',
  styleUrls: ['./supplier-contact.component.css']
})
export class SupplierContactComponent implements OnInit {

  suppliers: Supplier[] = [];
  selectedSupplier: Supplier | null = null;
  message: string = '';

  // ⭐ Rating Modal
  showRatingModal = false;
  ratingSupplierId: number | null = null;
  ratingValue: number = 0;
  ratingComment: string = '';
  hoverValue: number = 0;
  supplierRatings: any[] = [];

  // Create Supplier Modal
  showCreateModal = false;

  newSupplier: any = {
    suppliersName: '',
    suppliersContactPerson: '',
    suppliersEmail: '',
    suppliersPhone: '',
    address: ''
  };

  constructor(
    private supplierService: SupplierContactService,
    private ratingService: SupplierRatingService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => this.suppliers = data,
      error: (err) => {
        console.error('Failed to fetch suppliers', err);
        this.message = 'Failed to load suppliers.';
      }
    });
  }



    // ====== SUPPLIER REPORT (ALL SUPPLIERS) ======
  downloadSupplierReportPdf() {
    const url = 'http://localhost:8086/api/suppliers/report/pdf';
    window.open(url, '_blank');   // PDF – opens / downloads depending on browser
  }

  downloadSupplierReportCsv() {
    const url = 'http://localhost:8086/api/suppliers/report/csv';
    window.open(url, '_blank');   // CSV – will download because of attachment header
  }


    // ====== SINGLE SUPPLIER REPORT (PDF) ======
  downloadSupplierReportPdfFor(id: number) {
    const url = `http://localhost:8086/api/suppliers/report/pdf?id=${id}`;
    window.open(url, '_blank');
  }





  selectSupplier(supplier: Supplier): void {
    this.selectedSupplier = { ...supplier };
    this.message = '';
  }

  updateContact(): void {
    if (!this.selectedSupplier) return;

    this.supplierService.updateSupplierContact(
      this.selectedSupplier.suppliersId,
      {
        contactPerson: this.selectedSupplier.suppliersContactPerson,
        email: this.selectedSupplier.suppliersEmail,
        phone: this.selectedSupplier.suppliersPhone
      }
    ).subscribe({
      next: () => {
        this.message = 'Contact info updated successfully!';
        this.loadSuppliers();
        this.selectedSupplier = null;
      },
      error: (err) => {
        console.error("UPDATE ERROR:", err);
        this.message = 'Failed to update contact info.';
      }
    });
  }

  deleteContact(id: number): void {
    if (!confirm('Are you sure you want to delete contact info?')) return;

    this.supplierService.deleteSupplierContact(id).subscribe({
      next: () => {
        this.message = 'Contact info deleted successfully!';
        this.loadSuppliers();
        if (this.selectedSupplier?.suppliersId === id) {
          this.selectedSupplier = null;
        }
      },
      error: () => this.message = 'Failed to delete contact info.'
    });
  }

  // Create Supplier
  openCreateModal() { this.showCreateModal = true; }
  closeCreateModal() { this.showCreateModal = false; }

  createSupplier() {
    this.supplierService.createSupplier(this.newSupplier).subscribe({
      next: () => {
        this.message = 'Supplier added successfully!';
        this.closeCreateModal();
        this.loadSuppliers();
        this.newSupplier = {
          suppliersName: '',
          suppliersContactPerson: '',
          suppliersEmail: '',
          suppliersPhone: '',
          address: ''
        };
      },
      error: () => this.message = 'Failed to add supplier.'
    });
  }

  deleteSupplier(id: number) {
    if (!confirm('Delete supplier?')) return;

    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.message = 'Supplier deleted!';
        this.loadSuppliers();
      },
      error: () => this.message = 'Failed to delete supplier.'
    });
  }

  // Rating Modal
  openRatingModal(supplierId: number) {
    this.ratingSupplierId = supplierId;
    this.ratingValue = 0;
    this.ratingComment = '';
    this.showRatingModal = true;

    this.ratingService.getRatingsBySupplier(supplierId).subscribe(r => {
      this.supplierRatings = r;
    });
  }

  closeRatingModal() {
    this.showRatingModal = false;
  }

  submitRating() {
    if (!this.ratingSupplierId) return;

    const payload = {
      supplierId: this.ratingSupplierId,
      ratingValue: this.ratingValue,
      comments: this.ratingComment
    };

    this.ratingService.addRating(payload).subscribe({
      next: () => {
        this.message = "Rating submitted successfully!";
        this.closeRatingModal();
      },
      error: () => this.message = "Failed to submit rating."
    });
  }

  // ⭐⭐⭐ Rating System — FINAL VERSION (FULL STARS ONLY)
  getIcon(star: number): string {
    const value = this.hoverValue || this.ratingValue;
    return value >= star ? 'bi-star-fill text-warning' : 'bi-star text-warning';
  }

  setHover(star: number) { this.hoverValue = star; }
  clearHover() { this.hoverValue = 0; }
  setRating(star: number) { this.ratingValue = star; }
}
