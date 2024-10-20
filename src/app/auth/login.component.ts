import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from '../services/messages.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div class="flex justify-content-center flex-wrap mt-8 sm:mt-1 md:mt-4">
      <div class="flex justify-content-center align-items-center shadow-5">
        <p-card [style]="{ width: '360px' }">
          <div class="flex justify-content-center -mt-8">
            <img
              class="cursor-pointer -mt-4"
              src="/images/logo.png"
              alt="google"
            />
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: ``,
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private message: MessagesService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get isEmailValid(): string | boolean {
    const control = this.loginForm.get('email');

    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      return control.hasError('required')
        ? 'This field is required'
        : 'Enter a valid email';
    }

    return false;
  }

  get isValidPassword(): string | boolean {
    const control = this.loginForm.get('password');
    const isInvalid = control?.invalid && control.touched;

    if (isInvalid) {
      if (control.hasError('required')) {
        return 'This field is required';
      } else if (control.hasError('minlength')) {
        return 'Password must be at least 6 characters long';
      } else {
        return 'Enter a valid password';
      }
    }

    return false;
  }
}
