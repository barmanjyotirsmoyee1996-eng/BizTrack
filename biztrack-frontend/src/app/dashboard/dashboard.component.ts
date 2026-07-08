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
  expenseChartOptions: any;
  meetingChartOptions: any;

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
        this.initCharts();
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

  initCharts() {
    // 1. Expense Donut Chart Options
    const categories = this.expenseBreakdown.map(e => e.category);
    const amounts = this.expenseBreakdown.map(e => e.amount);

    this.expenseChartOptions = {
      series: amounts.length > 0 ? amounts : [0],
      chart: {
        type: 'donut',
        height: 290,
        background: 'transparent',
        foreColor: 'var(--text-secondary)'
      },
      labels: categories.length > 0 ? categories : ['No Expenses'],
      colors: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'],
      legend: {
        position: 'bottom',
        fontFamily: 'var(--primary-font)',
        fontSize: '12px'
      },
      dataLabels: {
        enabled: true,
        dropShadow: { enabled: false }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['var(--bg-card)']
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontFamily: 'var(--primary-font)',
                fontWeight: 600
              },
              value: {
                show: true,
                fontSize: '20px',
                fontFamily: 'var(--primary-font)',
                fontWeight: 700,
                color: 'var(--text-dark)',
                formatter: (val: any) => `$${parseFloat(val).toFixed(2)}`
              },
              total: {
                show: true,
                label: 'Total',
                color: 'var(--text-secondary)',
                formatter: (w: any) => {
                  const sum = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                  return `$${sum.toFixed(2)}`;
                }
              }
            }
          }
        }
      }
    };

    // 2. Meeting Type Breakdown Column Chart Options
    const onlineCount = this.stats.upcoming_meetings.filter((m: any) => m.meeting_type === 'Online').length;
    const offlineCount = this.stats.upcoming_meetings.filter((m: any) => m.meeting_type === 'In-Person').length;

    this.meetingChartOptions = {
      series: [
        {
          name: 'Meetings',
          data: [onlineCount, offlineCount]
        }
      ],
      chart: {
        type: 'bar',
        height: 290,
        toolbar: { show: false },
        background: 'transparent',
        foreColor: 'var(--text-secondary)'
      },
      colors: ['#4f46e5'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
          borderRadius: 6
        }
      },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Online', 'In-Person'],
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        title: { text: 'Count' },
        labels: {
          formatter: (val: number) => Math.round(val)
        }
      },
      fill: { opacity: 1 },
      grid: {
        borderColor: 'var(--border-light)',
        strokeDashArray: 4,
        yaxis: { lines: { show: true } }
      }
    };
  }
}
