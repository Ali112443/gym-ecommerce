import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../store.service';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
})
export class Checkout {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly store = inject(StoreService);
  readonly complete = signal(false);
  readonly orderId = signal('');
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s-]{7,15}$/)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    governorate: ['', Validators.required],
    notes: [''],
  });
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.store.cart().length) {
      this.router.navigate(['/cart']);
      return;
    }
    this.store.placeOrder(this.form.getRawValue());
    this.orderId.set(this.store.orders()[0].id);
    this.complete.set(true);
  }
}
