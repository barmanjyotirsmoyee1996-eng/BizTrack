import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  search = '';
  page = 1;
  totalPages = 1;
  totalItems = 0;
  loading = false;

  clientForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  selectedClientId: number | null = null;
  showModal = false;

  showDeleteModal = false;
  clientToDelete: any = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClients();
  }

  initForm() {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      company: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  get f() { return this.clientForm.controls; }

  loadClients() {
    this.loading = true;
    this.clientService.getClients(this.page, this.search).subscribe({
      next: (data) => {
        this.clients = data.data;
        this.page = data.current_page;
        this.totalPages = data.last_page;
        this.totalItems = data.total;
        this.loading = false;
      },
      error: () => {
        this.toastService.showError('Failed to load clients list.');
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.page = 1;
    this.loadClients();
  }

  clearSearch() {
    this.search = '';
    this.onSearch();
  }

  onPageChange(p: number) {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
      this.loadClients();
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.selectedClientId = null;
    this.submitted = false;
    this.clientForm.reset();
    this.showModal = true;
  }

  openEditModal(client: any) {
    this.isEditMode = true;
    this.selectedClientId = client.id;
    this.submitted = false;
    this.clientForm.patchValue({
      name: client.name,
      company: client.company,
      phone: client.phone,
      email: client.email,
      address: client.address
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    this.submitted = true;

    if (this.clientForm.invalid) {
      return;
    }

    const payload = this.clientForm.value;
    if (this.isEditMode && this.selectedClientId) {
      this.clientService.updateClient(this.selectedClientId, payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Client updated successfully.');
          this.closeModal();
          this.loadClients();
        },
        error: (err) => {
          const errors = err.error?.errors;
          const msg = errors ? Object.values(errors).flat().join(' ') : 'Failed to update client.';
          this.toastService.showError(msg);
        }
      });
    } else {
      this.clientService.createClient(payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Client created successfully.');
          this.closeModal();
          this.page = 1;
          this.loadClients();
        },
        error: (err) => {
          const errors = err.error?.errors;
          const msg = errors ? Object.values(errors).flat().join(' ') : 'Failed to create client.';
          this.toastService.showError(msg);
        }
      });
    }
  }

  confirmDelete(client: any) {
    this.clientToDelete = client;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.clientToDelete = null;
    this.showDeleteModal = false;
  }

  onDelete() {
    if (this.clientToDelete) {
      this.clientService.deleteClient(this.clientToDelete.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Client deleted successfully.');
          this.closeDeleteModal();
          this.loadClients();
        },
        error: () => {
          this.toastService.showError('Failed to delete client.');
        }
      });
    }
  }
}
