import { Component } from '@angular/core';
import { Home } from '../home/home';

@Component({
  imports: [Home],
  selector: 'app-products-grid',
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.css',
})
export default class ProductsGrid {}
