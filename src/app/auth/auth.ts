import { Component, inject, signal } from '@angular/core';
import { StoreService } from '../store.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-auth',
styleUrl: './auth.css',
  templateUrl: './auth.html',
})
export class Auth {
private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly register = signal(inject(ActivatedRoute).snapshot.data['register'] === true);
  readonly error = signal<boolean | string>(false);
  readonly store = inject(StoreService);
  readonly form = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  toggle(){
    this.register.update((value) => !value);
    this.error.set(false);
  }
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Please fill in all required fields correctly.');
      this.store.login(this.form.value);
this.router.navigate(['/']);
      return;
    }
    this.store.login(this.form.value);
    this.router.navigate([
      this.router.getCurrentNavigation()?.previousNavigation ? '/orders' : '/',
    ]);
  }
}
