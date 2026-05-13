import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
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
    private router: Router,
    private messageService: MessageService
  ) {}

  submit(): void {
    this.errorMessage = null;
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSubmitting) return;

    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';

    this.isSubmitting = true;

    this.authService
      .login({ email, password })
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Token zaten AuthService içinde kaydedildi
            console.log("sdaşsfaşasşasşs")
            this.router.navigateByUrl('/');
          } else {
            this.messageService.add({
              severity: 'error',
              detail: response.message || 'Giriş başarısız',
              life: 3000,
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            detail: 'Giriş sırasında bir hata oluştu',
            life: 3000,

          });
        },
      });
    }
  }
