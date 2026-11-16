import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { StoreService } from '../../store.service';

@Component({
  imports: [DecimalPipe, RouterLink],
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(StoreService);
  readonly productId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: Number(this.route.snapshot.paramMap.get('id')) },
  );
  readonly product = computed(() =>
    this.store.products.find((item) => item.id === this.productId()),
  );
  readonly selectedSize = signal('');
  readonly selectedColor = signal('');
  readonly added = signal(false);

  addToBag() {
    const item = this.product();
    if (!item) return;
    this.store.addToCart(
      item,
      this.selectedSize() || item.sizes[0],
      this.selectedColor() || item.colors[0],
    );
    this.added.set(true);
  }
}
