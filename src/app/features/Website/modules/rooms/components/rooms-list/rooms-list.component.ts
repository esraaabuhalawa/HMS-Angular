import { Component, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { WebsitePageHeadingComponent } from '../../../../../../shared/components/website/ui/website-page-heading/website-page-heading.component';
import { RoomsService } from '../../services/rooms.service';
import { IRoom } from '../../../../../../shared/interfaces/general.interface';
import { CardSkeltonComponent } from '../../../../../../shared/components/website/ui/card-skelton/card-skelton.component';
import { RoomInfoCardComponent } from '../../../../../../shared/components/website/ui/room-info-card/room-info-card.component';
import { finalize } from 'rxjs';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { TranslatePipe ,TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rooms-list',
  imports: [WebsitePageHeadingComponent, CardSkeltonComponent, RoomInfoCardComponent, Paginator ,TranslatePipe],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss',
})
export class RoomsListComponent {
  private roomsService = inject(RoomsService);
  private translate = inject(TranslateService);

  home!: MenuItem;
breadcrumbs!: MenuItem[];

  roomsList = signal<IRoom[]>([]);
  isLoading = signal(false);

  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;



  buildBreadcrumbs() {
  this.home = {
    label: this.translate.instant('COMMON.HOME'),
    routerLink: '/',
  };

  this.breadcrumbs = [
    {
      label: this.translate.instant('COMMON.Explore'),
    },
  ];
}
  fetchRooms() {
    this.isLoading.set(true);

    this.roomsService
      .getAllRooms({
        page: this.currentPage,
        size: this.pageSize,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.roomsList.set(res.data.rooms);
          this.totalRecords = res.data.totalCount;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  ngOnInit(): void {
    this.buildBreadcrumbs();
  this.fetchRooms();

  this.translate.onLangChange.subscribe(() => {
    this.buildBreadcrumbs();
  });
  }

  onPageChange(event: PaginatorState) {
    this.currentPage = (event.page ?? 0) + 1;
    this.pageSize = event.rows ?? 10;

    this.fetchRooms();
  }
}
