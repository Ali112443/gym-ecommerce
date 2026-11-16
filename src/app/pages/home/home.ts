import { Component, computed, inject, signal } from '@angular/core';
import { StoreService } from '../../store.service';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  readonly store = inject(StoreService);
  readonly category = signal('All');
  readonly query = signal('');
  readonly sort = signal('featured');
  readonly maxPrice = signal(99999);
  readonly filteredProducts = computed(() => {
    let list = this.store.products.filter(
      (product) =>
      (this.category() === 'All' || product.category === this.category()) &&
      product.name.toLowerCase().includes(this.query().toLowerCase()) &&
      product.price <= this.maxPrice()
    );
  if(this.sort()=== 'low') list = [...list].sort((a, b) => a.price - b.price);
  if(this.sort()=== 'high') list = [...list].sort((a, b) => b.price - a.price);
  return list;
  });

}
