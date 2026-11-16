import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../theme.service/theme.service';
import { StoreService } from '../../store.service';
@Component({
  imports: [MatToolbarModule, MatIcon, RouterLink, RouterLinkActive],
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly themeService = inject(ThemeService);
  readonly store = inject(StoreService);
}
