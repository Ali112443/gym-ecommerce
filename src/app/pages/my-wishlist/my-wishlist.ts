import { Component } from '@angular/core';
import { Wishlist } from '../wishlist/wishlist';

@Component({
  imports: [Wishlist],
  selector: 'app-my-wishlist',
  templateUrl: './my-wishlist.html',
  styleUrl: './my-wishlist.css',
})
export default class MyWishlist {}
