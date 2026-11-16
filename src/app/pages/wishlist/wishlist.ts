import { Component, inject } from '@angular/core';
import { StoreService } from '../../store.service';
import{RouterLink} from '@angular/router';
import{DecimalPipe} from '@angular/common';
@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-wishlist',
  styleUrl:'./wishlist.css',
  templateUrl:'./wishlist.html', 
})
export class Wishlist {
  readonly store = inject(StoreService);
  saved(){
    return this.store.products.filter((product) => this.store.wishlist().includes(product.id));
  }
}
