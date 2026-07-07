import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';

  // Registration fields for convenience
  isRegisterMode = false;
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    // redirect to dashboard if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() { return this.loginForm.controls; }
  get rf() { return this.registerForm.controls; }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.error = '';
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.isRegisterMode) {
      if (this.registerForm.invalid) {
        return;
      }
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.toastService.showSuccess('Registration successful!');
          this.router.navigate([this.returnUrl]);
        },
        error: err => {
          this.error = err.error?.message || 'Registration failed. Try again.';
          this.toastService.showError(this.error);
          this.loading = false;
        }
      });
    } else {
      if (this.loginForm.invalid) {
        return;
      }
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.toastService.showSuccess('Login successful!');
          this.router.navigate([this.returnUrl]);
        },
        error: err => {
          this.error = 'Invalid email or password.';
          this.toastService.showError(this.error);
          this.loading = false;
        }
      });
    }
  }
}
