import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IAddFavoriteResponse, IAllFavoriteResponse } from '../interfaces/favorites.interface';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { IRoom } from '../../../../../shared/interfaces/general.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private translate = inject(TranslateService);

  favorites = signal<string[]>([]);
  favoriteRooms = signal<IRoom[]>([]);
  isUpdating = signal(false);

  readonly favoriteCount = computed(() => this.favorites().length);

  loadFavorites() {
    this.isUpdating.set(true);
    this.getAllFavorites().subscribe({
      next: (res) => {
        const rooms = res.data.favoriteRooms.flatMap(favorite => favorite.rooms);
        this.favorites.set(rooms.map(room => room._id));
        this.favoriteRooms.set(rooms);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isUpdating.set(false);
      }
    });
  }

  isFavorite(roomId: string): boolean {
    return this.favorites().includes(roomId);
  }

  getAllFavorites(): Observable<IAllFavoriteResponse> {
    return this.http.get<IAllFavoriteResponse>('portal/favorite-rooms');
  }

  addFavorite(room: IRoom):void {
    // optimistic update
    this.favorites.update(ids => ids.includes(room._id) ? ids : [...ids, room._id]);
    this.favoriteRooms.update(rooms => [...rooms, room]);
    this.http.post<IAddFavoriteResponse>('portal/favorite-rooms', { roomId: room._id }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.translate.instant('COMMON.ADDED_TO_FAVORITES')
        });
      },
      error: (err) => {
        // rollback if request fails
        this.favorites.update(ids => ids.filter(id => id !== room._id));
        this.favoriteRooms.update(rooms => rooms.filter(r => r._id !== room._id));

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
    this.favoriteRooms.update(rooms => rooms.filter(room => room._id !== roomId));
    this.http.delete<IAllFavoriteResponse>(`portal/favorite-rooms/${roomId}`,{ body: { roomId } }).subscribe({
      next: () => {
        // reload, then clear loading once fresh data is in
        this.loadFavorites();
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

  toggleFavorite(room: IRoom) {
    if (this.isFavorite(room._id)) {
      this.removeFavorite(room._id);
    } else {
      this.addFavorite(room);
    }
    this.loadFavorites();
  }
}
