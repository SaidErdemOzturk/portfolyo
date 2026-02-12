import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  errorMessage: string | null = null;
  isSubmitting = false;
  showPassword = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  submit(): void {
    this.errorMessage = null;
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSubmitting) return;

    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';

    this.isSubmitting = true;
    this.loadingService.show();

    this.authService
      .login({ email, password })
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          // Backend şekli bilinmediği için güvenli bir fallback mesajı
          this.errorMessage = err?.error?.message ?? 'Giriş başarısız. Bilgileri kontrol edip tekrar deneyin.';
        },
      });
  }
}

