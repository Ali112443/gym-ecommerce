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

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

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

  cart = signal<CartItem[]>(JSON.parse(localStorage.getItem('iron-cart') || '[]'));
  wishlist = signal<number[]>(JSON.parse(localStorage.getItem('iron-wishlist') || '[2,7]'));
  isDark = signal(localStorage.getItem('iron-dark') !== 'false');
  isLoggedIn = signal(localStorage.getItem('iron-user') === 'true');
  orders = signal<any[]>(JSON.parse(localStorage.getItem('iron-orders') || '[]'));
  reviews = signal<ProductReview[]>(JSON.parse(localStorage.getItem('iron-reviews') || '[]'));
  coupon = signal('');
  readonly cartCount = computed(() => this.cart().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );
  readonly discount = computed(() =>
    this.coupon().toUpperCase() === 'IRON15' ? Math.round(this.subtotal() * 0.15) : 0,
  );
  readonly total = computed(() => this.subtotal() - this.discount());

  saveCart(items: CartItem[]) {
    this.cart.set(items);
    localStorage.setItem('iron-cart', JSON.stringify(items));
  }
  addToCart(product: Product, size = product.sizes[0], color = product.colors[0]) {
    const items = [...this.cart()];
    const existing = items.find(
      (item) => item.product.id === product.id && item.size === size && item.color === color,
    );
    if (existing) existing.quantity++;
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
  toggleTheme() {
    this.isDark.update((value) => !value);
    localStorage.setItem('iron-dark', String(this.isDark()));
  }
  login(value: Partial<{ name: string | null; email: string | null; password: string | null; }>) {
    localStorage.setItem('iron-user', 'true');
    this.isLoggedIn.set(true);
  }
  logout() {
    localStorage.setItem('iron-user', 'false');
    this.isLoggedIn.set(false);
  }
  placeOrder(data: unknown) {
    const next = [
      {
        id: `IH-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString('en-US'),
        total: this.total() + (this.subtotal() > 2000 ? 0 : 75),
        status: 'Processing',
        items: this.cart().length,
        shipping: data,
      },
      ...this.orders(),
    ];
    this.orders.set(next);
    localStorage.setItem('iron-orders', JSON.stringify(next));
    this.saveCart([]);
    this.coupon.set('');
  }
  addReview(review: ProductReview) {
    const next = [review, ...this.reviews()];
    this.reviews.set(next);
    localStorage.setItem('iron-reviews', JSON.stringify(next));
  }
}
