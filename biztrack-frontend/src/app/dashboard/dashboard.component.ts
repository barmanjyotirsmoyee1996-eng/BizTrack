import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {
    total_clients: 0,
    upcoming_meetings_count: 0,
    today_meetings_count: 0,
    total_expenses: 0,
    upcoming_meetings: [],
    recent_expenses: []
  };
  loading = true;
  expenseBreakdown: { category: string, amount: number, percentage: number }[] = [];
  todayDate = new Date();
  currentUser: any = null;

  constructor(
    private dashboardService: DashboardService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.calculateBreakdown();
        this.loading = false;
      },
      error: () => {
        this.toastService.showError('Failed to load dashboard statistics.');
        this.loading = false;
      }
    });
  }

  calculateBreakdown() {
    const totals: { [key: string]: number } = {};
    let grandTotal = 0;
    
    // Group all expenses by category
    this.stats.recent_expenses.forEach((e: any) => {
      const amt = parseFloat(e.amount);
      totals[e.category] = (totals[e.category] || 0) + amt;
      grandTotal += amt;
    });

    this.expenseBreakdown = Object.keys(totals).map(cat => ({
      category: cat,
      amount: totals[cat],
      percentage: grandTotal > 0 ? Math.round((totals[cat] / grandTotal) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);
  }

  getFirstName(): string {
    if (!this.currentUser || !this.currentUser.name) {
      return 'User';
    }
    return this.currentUser.name.split(' ')[0];
  }
}
