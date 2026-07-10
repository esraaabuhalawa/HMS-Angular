import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { CardSkeltonComponent } from '../../../../../../shared/components/website/ui/card-skelton/card-skelton.component';
import { RoomInfoCardComponent } from '../../../../../../shared/components/website/ui/room-info-card/room-info-card.component';
import { WebsitePageHeadingComponent } from '../../../../../../shared/components/website/ui/website-page-heading/website-page-heading.component';
import { FavoritesService } from '../../services/favorites.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites-list',
  imports: [WebsitePageHeadingComponent, CardSkeltonComponent,
    RoomInfoCardComponent, Paginator, TranslatePipe, RouterLink],
  templateUrl: './favorites-list.component.html',
  styleUrl: './favorites-list.component.scss',
})
export class FavoritesListComponent {
  private translate = inject(TranslateService);
  private favoritesService = inject(FavoritesService);
  home!: MenuItem;
  breadcrumbs!: MenuItem[];

  // pagination state
  currentPage = signal<number>(1);
  pageSize = signal<number>(9);

  // full list straight from the service
  favoritesList = computed(() => this.favoritesService.favoriteRooms());

  // total count for the paginator
  totalRecords = computed(() => this.favoritesList().length);

  // empty state = not loading AND no favorites
  isEmpty = computed(() => !this.isUpdating() && this.favoritesList().length === 0);

  isUpdating = this.favoritesService.isUpdating;

  ngOnInit(): void {
    this.buildBreadcrumbs();
    this.translate.onLangChange.subscribe(() => {
      this.buildBreadcrumbs();
    });
  }

  // the slice actually rendered
  paginatedFavorites = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.favoritesList().slice(start, start + this.pageSize());
  });

  buildBreadcrumbs() {
    this.home = {
      label: this.translate.instant('COMMON.HOME'),
      routerLink: '/',
    };

    this.breadcrumbs = [
      {
        label: this.translate.instant('NAVBAR.FAVORITES'),
      },
    ];
  }

  onPageChange(event: PaginatorState) {
    this.currentPage.set((event.page ?? 0) + 1);
    this.pageSize.set(event.rows ?? this.pageSize());
  }
}
