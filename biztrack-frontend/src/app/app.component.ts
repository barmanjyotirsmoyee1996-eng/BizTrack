import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastService, Toast } from './services/toast.service';
import { filter } from 'rxjs/operators';

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
  private inactivityTimeout: any;
  private readonly TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.resetInactivityTimer();
      } else {
        this.clearInactivityTimer();
      }
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

    // Auto collapse sidebar on mobile route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (window.innerWidth < 768) {
        this.sidebarCollapsed = false;
      }
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

  // Listen to user activity events to reset inactivity timer
  @HostListener('document:mousemove')
  @HostListener('document:click')
  @HostListener('document:keypress')
  @HostListener('document:scroll')
  @HostListener('document:touchstart')
  onUserActivity() {
    if (this.isLoggedIn()) {
      this.resetInactivityTimer();
    }
  }

  resetInactivityTimer() {
    this.clearInactivityTimer();
    if (this.isLoggedIn()) {
      this.inactivityTimeout = setTimeout(() => {
        this.handleAutoLogout();
      }, this.TIMEOUT_DURATION);
    }
  }

  clearInactivityTimer() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
  }

  handleAutoLogout() {
    this.clearInactivityTimer();
    if (this.isLoggedIn()) {
      this.authService.logout().subscribe({
        next: () => {
          this.toastService.showWarning('You have been logged out due to inactivity.');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.authService.clearSession();
          this.toastService.showWarning('Session expired due to inactivity.');
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
