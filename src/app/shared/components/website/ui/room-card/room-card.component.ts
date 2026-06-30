import { Component, Input } from '@angular/core';
import { IRoom } from '../../../../interfaces/general.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-room-card',
  imports: [ RouterLink],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.scss',
})
export class RoomCardComponent {
  @Input() room!: IRoom;
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/images/placeholder-img.jpg';
  }
}
