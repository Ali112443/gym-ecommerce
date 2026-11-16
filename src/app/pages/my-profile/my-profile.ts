import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../store.service';

@Component({
  imports: [RouterLink],
  selector: 'app-my-profile',
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export default class MyProfile {
  readonly store = inject(StoreService);
}
