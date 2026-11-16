import { Component, inject } from '@angular/core';
import { StoreService } from '../../store.service';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
    readonly store = inject(StoreService);
  couponCode = '';
  couponMessage = '';
  quantity(item: any, change: number) {
    this.store.saveCart(
      this.store
        .cart()
        .map((current) =>
          current === item
            ? { ...current, quantity: Math.max(1, current.quantity + change) }
            : current,
        ),
    );
  }
  remove(item: any) {
    this.store.saveCart(this.store.cart().filter((current) => current !== item));
  }
  applyCoupon() {
    if (this.couponCode.trim().toUpperCase() === 'IRON15') {
      this.store.coupon.set('IRON15');
      this.couponMessage = '15% discount applied. Nice one.';
    } else this.couponMessage = 'That code is not valid. Try IRON15.';
  }
}
