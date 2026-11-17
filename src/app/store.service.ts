import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  description: string;
  colors: string[];
  sizes: string[];
}
export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}
export interface ProductReview {
  productId: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}
export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
  lines: CartItem[];
  shipping: unknown;
}
export interface User {
  name: string;
  email: string;
}

const FREE_SHIPPING_FROM = 2000;
const SHIPPING_FEE = 75;

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  readonly products: Product[] = [
    // ... سيب المنتجات الـ 8 زي ما هي بالظبط ...
  ];

  cart = signal<CartItem[]>(this.syncCart(load<CartItem[]>('iron-cart', [])));
  wishlist = signal<number[]>(load<number[]>('iron-wishlist', []));
  orders = signal<Order[]>(load<Order[]>('iron-orders', []));
  reviews = signal<ProductReview[]>(load<ProductReview[]>('iron-reviews', []));
  user = signal<User | null>(load<User | null>('iron-user-data', null));
  coupon = signal('');

  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly cartCount = computed(() => this.cart().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );
  readonly discount = computed(() =>
    this.coupon().toUpperCase() === 'IRON15' ? Math.round(this.subtotal() * 0.15) : 0,
  );
  readonly total = computed(() => this.subtotal() - this.discount());
  readonly shipping = computed(() =>
    this.cart().length === 0 || this.subtotal() > FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE,
  );
  readonly grandTotal = computed(() => this.total() + this.shipping());

  /** بيحدّث سعر وبيانات المنتج في الـ cart القديم من الليستة الحالية */
  private syncCart(items: CartItem[]): CartItem[] {
    return items.map((item) => ({
      ...item,
      product: this.products.find((p) => p.id === item.product.id) ?? item.product,
    }));
  }

  saveCart(items: CartItem[]) {
    this.cart.set(items);
    localStorage.setItem('iron-cart', JSON.stringify(items));
  }

  addToCart(product: Product, size = product.sizes[0], color = product.colors[0]) {
    const items = [...this.cart()];
    const index = items.findIndex(
      (item) => item.product.id === product.id && item.size === size && item.color === color,
    );
    if (index >= 0) items[index] = { ...items[index], quantity: items[index].quantity + 1 };
    else items.push({ product, quantity: 1, size, color });
    this.saveCart(items);
  }

  toggleWishlist(id: number) {
    const next = this.wishlist().includes(id)
      ? this.wishlist().filter((item) => item !== id)
      : [...this.wishlist(), id];
    this.wishlist.set(next);
    localStorage.setItem('iron-wishlist', JSON.stringify(next));
  }

  login(value: Partial<{ name: string | null; email: string | null; password: string | null }>) {
    const email = value.email ?? '';
    const user: User = {
      name: value.name?.trim() || email.split('@')[0] || 'Athlete',
      email,
    };
    this.user.set(user);
    localStorage.setItem('iron-user-data', JSON.stringify(user));
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('iron-user-data');
  }

  placeOrder(data: unknown): Order | null {
    if (this.cart().length === 0) return null;
    const order: Order = {
      id: `IH-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-US'),
      total: this.grandTotal(),
      status: 'Processing',
      items: this.cartCount(),
      lines: this.cart(),
      shipping: data,
    };
    const next = [order, ...this.orders()];
    this.orders.set(next);
    localStorage.setItem('iron-orders', JSON.stringify(next));
    this.saveCart([]);
    this.coupon.set('');
    return order;
  }

  addReview(review: ProductReview) {
    const next = [review, ...this.reviews()];
    this.reviews.set(next);
    localStorage.setItem('iron-reviews', JSON.stringify(next));
  }
}