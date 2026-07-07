import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastService, Toast } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'biztrack-frontend';
  sidebarCollapsed = false;
  currentUser: any = null;
  toasts: Toast[] = [];

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.toastService.toast$.subscribe(toast => {
      this.toasts.push(toast);
      // Auto close after 3.5 seconds
      setTimeout(() => {
        const index = this.toasts.indexOf(toast);
        if (index > -1) {
          this.toasts.splice(index, 1);
        }
      }, 3500);
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.showSuccess('Logged out successfully.');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastService.showSuccess('Logged out.');
        this.router.navigate(['/login']);
      }
    });
  }

  removeToast(index: number) {
    this.toasts.splice(index, 1);
  }
}
