import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';
import { ClientService } from '../services/client.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  expenses: any[] = [];
  clients: any[] = [];
  categoryFilter = '';
  search = '';
  page = 1;
  totalPages = 1;
  totalItems = 0;
  loading = false;

  expenseForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  selectedExpenseId: number | null = null;
  showModal = false;

  showDeleteModal = false;
  expenseToDelete: any = null;

  categories = [
    'Travel',
    'Marketing',
    'Office Supplies',
    'Software & Tools',
    'Utilities',
    'Salaries',
    'Other'
  ];

  paymentModes = [
    'Cash',
    'Card',
    'UPI',
    'Bank Transfer'
  ];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private clientService: ClientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadExpenses();
    this.loadClients();
  }

  initForm() {
    this.expenseForm = this.fb.group({
      client_id: [''], // optional
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      payment_mode: ['Cash', Validators.required],
      expense_date: ['', Validators.required],
      notes: ['']
    });
  }

  get f() { return this.expenseForm.controls; }

  loadExpenses() {
    this.loading = true;
    this.expenseService.getExpenses(this.page, this.categoryFilter, this.search).subscribe({
      next: (data) => {
        this.expenses = data.data;
        this.page = data.current_page;
        this.totalPages = data.last_page;
        this.totalItems = data.total;
        this.loading = false;
      },
      error: () => {
        this.toastService.showError('Failed to load expenses.');
        this.loading = false;
      }
    });
  }

  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: () => {
        this.toastService.showError('Failed to load clients dropdown data.');
      }
    });
  }

  onFilter() {
    this.page = 1;
    this.loadExpenses();
  }

  clearSearch() {
    this.search = '';
    this.onFilter();
  }

  onPageChange(p: number) {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
      this.loadExpenses();
    }
  }

  openAddModal() {
    this.isEditMode = false;
    this.selectedExpenseId = null;
    this.submitted = false;
    this.expenseForm.reset({
      client_id: '',
      payment_mode: 'Cash',
      category: '',
      notes: ''
    });
    this.showModal = true;
  }

  openEditModal(expense: any) {
    this.isEditMode = true;
    this.selectedExpenseId = expense.id;
    this.submitted = false;
    this.expenseForm.patchValue({
      client_id: expense.client_id || '',
      category: expense.category,
      amount: expense.amount,
      payment_mode: expense.payment_mode,
      expense_date: expense.expense_date,
      notes: expense.notes
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    this.submitted = true;

    if (this.expenseForm.invalid) {
      return;
    }

    const payload = { ...this.expenseForm.value };
    if (payload.client_id === '') {
      payload.client_id = null;
    }

    if (this.isEditMode && this.selectedExpenseId) {
      this.expenseService.updateExpense(this.selectedExpenseId, payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Expense updated successfully.');
          this.closeModal();
          this.loadExpenses();
        },
        error: (err) => {
          const errors = err.error?.errors;
          const msg = errors ? Object.values(errors).flat().join(' ') : 'Failed to update expense.';
          this.toastService.showError(msg);
        }
      });
    } else {
      this.expenseService.createExpense(payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Expense recorded successfully.');
          this.closeModal();
          this.page = 1;
          this.loadExpenses();
        },
        error: (err) => {
          const errors = err.error?.errors;
          const msg = errors ? Object.values(errors).flat().join(' ') : 'Failed to create expense.';
          this.toastService.showError(msg);
        }
      });
    }
  }

  confirmDelete(expense: any) {
    this.expenseToDelete = expense;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.expenseToDelete = null;
    this.showDeleteModal = false;
  }

  onDelete() {
    if (this.expenseToDelete) {
      this.expenseService.deleteExpense(this.expenseToDelete.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Expense deleted successfully.');
          this.closeDeleteModal();
          this.loadExpenses();
        },
        error: () => {
          this.toastService.showError('Failed to delete expense.');
        }
      });
    }
  }
}
