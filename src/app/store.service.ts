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
    {
      id: 1,
      name: 'Iron Classic Tee',
      category: 'T-Shirts',
      price: 890,
      oldPrice: 1100,
      rating: 4.9,
      reviews: 128,
      image: photo('photo-1583743814966-8936f5b7be1a'),
      badge: 'BEST SELLER',
      description:
        'A relaxed athletic tee in performance cotton, made to move with you through every set.',
      colors: ['Black', 'Grey', 'Olive'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 2,
      name: 'Flex Training Shorts',
      category: 'Shorts',
      price: 760,
      rating: 4.8,
      reviews: 86,
      image: photo('photo-1591195853828-11db59a44f6b'),
      description:
        'Lightweight training shorts with side pockets and an adjustable drawcord. Ready for your next session.',
      colors: ['Black', 'Grey'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 3,
      name: 'Power Oversized Hoodie',
      category: 'T-Shirts',
      price: 1450,
      oldPrice: 1690,
      rating: 5.0,
      reviews: 54,
      image: photo('photo-1556821840-3a63f95609a7'),
      badge: 'NEW DROP',
      description:
        'The perfect layer before and after training. An oversized fit with a soft brushed inside.',
      colors: ['Black', 'Grey', 'Green'],
      sizes: ['M', 'L', 'XL'],
    },
    {
      id: 4,
      name: 'Grip Pro Lifting Gloves',
      category: 'Accessories',
      price: 520,
      rating: 4.7,
      reviews: 93,
      image: photo('photo-1583454110551-21f2fa2afe61'),
      description:
        'A steady grip and added comfort for every lift. Flexible fabric with padded palms.',
      colors: ['Black', 'Green'],
      sizes: ['S', 'M', 'L'],
    },
    {
      id: 5,
      name: 'Dry Fit Edge Tee',
      category: 'T-Shirts',
      price: 950,
      rating: 4.8,
      reviews: 71,
      image: photo('photo-1503342217505-b0a15ec3261c'),
      description: 'Quick-dry fabric and an athletic cut to keep you moving from your first rep.',
      colors: ['Grey', 'Black'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 6,
      name: 'Enduro Training Shorts',
      category: 'Shorts',
      price: 690,
      oldPrice: 820,
      rating: 4.6,
      reviews: 49,
      image: photo('photo-1517836357463-d25dfeac3438'),
      description:
        'Made for full range of motion, with light stretch fabric for a comfortable workout.',
      colors: ['Black', 'Olive'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 7,
      name: 'Active Gym Duffel',
      category: 'Accessories',
      price: 1250,
      rating: 4.9,
      reviews: 38,
      image: photo('photo-1553062407-98eeb64c6a62'),
      badge: 'OUR PICK',
      description:
        'Carry your training essentials in one place. Roomy main compartment and a separate shoe pocket.',
      colors: ['Black', 'Grey'],
      sizes: ['One size'],
    },
    {
      id: 8,
      name: 'Steel Bottle 750ml',
      category: 'Accessories',
      price: 430,
      rating: 4.7,
      reviews: 62,
      image: photo('photo-1602143407151-7111542de6e8'),
      description: 'Stay hydrated with a durable, easy-to-carry stainless steel bottle.',
      colors: ['Black', 'Green'],
      sizes: ['One size'],
    },
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