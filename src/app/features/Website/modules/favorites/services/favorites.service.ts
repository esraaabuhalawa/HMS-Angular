import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IAddFavoriteResponse, IAllFavoriteResponse } from '../interfaces/favorites.interface';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private translate = inject(TranslateService);

  favorites = signal<string[]>([]);

  loadFavorites() {
    this.getAllFavorites().subscribe({
      next: (res) => {
        const roomIds = res.data.favoriteRooms.flatMap(favorite =>
          favorite.rooms.map(room => room._id)
        );

        this.favorites.set(roomIds);
      }
    });
  }

  isFavorite(roomId: string): boolean {
    return this.favorites().includes(roomId);
  }

  getAllFavorites(): Observable<IAllFavoriteResponse> {
    return this.http.get<IAllFavoriteResponse>('portal/favorite-rooms');
  }

  addFavorite(roomId: string):void {
    // optimistic update
    this.favorites.update(ids => ids.includes(roomId) ? ids : [...ids, roomId]);

    this.http.post<IAddFavoriteResponse>('portal/favorite-rooms', { roomId }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.translate.instant('COMMON.ADDED_TO_FAVORITES')
        });
      },
      error: (err) => {
        // rollback if request fails
        this.favorites.update(ids => ids.filter(id => id !== roomId));
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || err.message ||
            this.translate.instant('COMMON.SOMETHING_WENT_WRONG'),
        });
      }
    });
  }

  removeFavorite(roomId: string):void {
    const previous = this.favorites();
    // optimistic update
    this.favorites.update(ids => ids.filter(id => id !== roomId));

    this.http.delete<IAllFavoriteResponse>(`portal/favorite-rooms/${roomId}`,{ body: { roomId } }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.translate.instant('COMMON.REMOVED_FROM_FAVORITES')
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || err.message ||
            this.translate.instant('COMMON.SOMETHING_WENT_WRONG'),
        });
        // rollback if request fails
        this.favorites.set(previous);
      }
    });
  }

  toggleFavorite(roomId: string) {
    if (this.isFavorite(roomId)) {
      this.removeFavorite(roomId);
    } else {
      this.addFavorite(roomId);
    }
  }
}
