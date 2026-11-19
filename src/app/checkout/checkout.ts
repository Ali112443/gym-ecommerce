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
  private static readonly WHATSAPP_PHONE = '201068727501';
  readonly paymentMethod = signal<'instapay' | 'vodafone-cash'>('instapay');
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
    const checkoutDetails = {
      ...this.form.getRawValue(),
      paymentMethod: this.paymentMethod(),
      paymentNumber: '01068727501',
    };
    const orderMessage = this.buildWhatsAppMessage(checkoutDetails);
    const order = this.store.placeOrder(checkoutDetails);
    if (!order) {
      this.router.navigate(['/cart']);
      return;
    }

    this.orderId.set(order.id);
    this.complete.set(true);
    const whatsappMessage = `Order number: ${order.id}\n${orderMessage}`;
    window.location.assign(
      `https://wa.me/${Checkout.WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`,
    );
  }

  private buildWhatsAppMessage(details: ReturnType<typeof this.form.getRawValue>): string {
    const paymentName = this.paymentMethod() === 'instapay' ? 'InstaPay' : 'Vodafone Cash';
    const products = this.store
      .cart()
      .map(
        ({ product, quantity, size, color }) =>
          `• ${product.name} (${color}, ${size}) × ${quantity} — EGP ${product.price * quantity}`,
      )
      .join('\n');

    return [
      'New order from Spider House',
      `Name: ${details.firstName} ${details.lastName}`,
      `Phone: ${details.phone}`,
      `Email: ${details.email}`,
      `Address: ${details.address}, ${details.city}, ${details.governorate}`,
      `Payment: ${paymentName}`,
      `Transfer number: 01068727501`,
      'Items:',
      products,
      `Total: EGP ${this.store.grandTotal()}`,
      details.notes ? `Notes: ${details.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }
}
