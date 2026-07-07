import { FavoritesService } from './../../../../../features/Website/modules/favorites/services/favorites.service';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

import { IRoom } from '../../../../interfaces/general.interface';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../../features/Auth/services/auth.service';

@Component({
  selector: 'app-room-info-card',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    TooltipModule,
    RippleModule,
    TranslatePipe
  ],
  templateUrl: './room-info-card.component.html',
  styleUrls: ['./room-info-card.component.scss']
})
export class RoomInfoCardComponent {
  @Input({ required: true }) room!: IRoom;
  @Input({required: false}) showDetailsIcon : boolean = true;

  favoritesService = inject(FavoritesService)
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private translate = inject(TranslateService);

  onToggleFavorite() {
    if (this.authService.isLoggedIn()) {
      this.favoritesService.toggleFavorite(this.room);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.translate.instant('COMMON.PLEASE_LOG_IN_FIRST'),
      });
    }
  }

  get isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.room._id)
  }

  //image Error
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/images/placeholder-img.jpg';
  }
}
