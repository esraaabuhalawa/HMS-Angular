import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAd } from '../../../../../features/Dashboard/modules/Ads/interfaces/ads.interface';
import { Tag } from 'primeng/tag';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-ad-card',
  imports: [Tag, RouterLink],
  templateUrl: './ad-card.component.html',
  styleUrl: './ad-card.component.scss',
})
export class AdCardComponent {
  @Input({ required: true }) ad!: IAd;

  @Output() favorite = new EventEmitter<IAd>();

  onFavorite() {
    this.favorite.emit(this.ad);
  }
}
