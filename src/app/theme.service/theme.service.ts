import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';

  readonly isDarkMode = signal(this.getInitialTheme());

  constructor() {
    effect(() => {
      const dark = this.isDarkMode();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
    });
  }

  toggleTheme() {
    this.isDarkMode.update((value) => !value);
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}