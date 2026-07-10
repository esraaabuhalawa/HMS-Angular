import { Component, Input } from '@angular/core';
import { IRoom } from '../../../../interfaces/general.interface';
import {  DecimalPipe, SlicePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { TagModule } from 'primeng/tag';
import { TranslatePipe } from '@ngx-translate/core';

export type RoomCardVariant = 'grid' | 'ad';

@Component({
  selector: 'app-home-common-card',
  imports: [DecimalPipe, SlicePipe, RouterLink, TagModule,TranslatePipe],
  templateUrl: './home-common-card.component.html',
  styleUrl: './home-common-card.component.scss',
})
export class HomeCommonCardComponent {
  @Input({ required: true }) room!: IRoom;
  @Input() variant: RoomCardVariant = 'grid';
  @Input() isActive?: boolean;
  @Input() linkPrefix = '/rooms/';

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/images/placeholder-img.png';
  }
}
