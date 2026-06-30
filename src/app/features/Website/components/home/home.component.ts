import { Component, computed, inject, signal } from '@angular/core';
import { HeroSectionComponent } from '../../../../shared/components/website/home/hero-section/hero-section.component';
import { RoomCardComponent } from "../../../../shared/components/website/ui/room-card/room-card.component";
import { CustomersSectionComponent } from '../../../../shared/components/website/home/customers-section/customers-section.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { IAd, IAdsResponse } from '../../../Dashboard/modules/Ads/interfaces/ads.interface';
import { AdsService } from '../../services/ads.service';
import { IRoom } from '../../../../shared/interfaces/general.interface';
import { RoomsService } from '../../modules/rooms/services/rooms.service';
import { IRoomsResponse } from '../../modules/rooms/interfaces/rooms.interface';
import { RoomInfoCardComponent } from '../../../../shared/components/website/ui/room-info-card/room-info-card.component';
import { CardSkeltonComponent } from "../../../../shared/components/website/ui/card-skelton/card-skelton.component";

@Component({
  selector: 'app-home',
  imports: [HeroSectionComponent, RoomInfoCardComponent,
    CustomersSectionComponent, CardSkeltonComponent, RoomCardComponent, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private adsService = inject(AdsService);
  private roomsService = inject(RoomsService);
  private readonly messageService = inject(MessageService);
  private translate = inject(TranslateService);
  isLoading = signal<boolean>(false);
  loadingSearch = signal<boolean>(false);
  isLoadingRooms = signal<boolean>(false);
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  adsList = signal<IAd[]>([]);
  roomList = signal<IRoom[]>([]);

  ngOnInit(): void {
    this.fetchAdsData();
    this.fetchRooms()
  }

  fetchAdsData() {
    this.isLoading.set(true);
    this.adsService.getAllAds({ page: this.currentPage, size: 4 }).subscribe({
      next: (res: IAdsResponse) => {
        this.adsList.set(res.data.ads);
        this.totalRecords = res.data.totalCount;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false)
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || this.translate.instant('COMMON.SOMETHING_WENT_WRONG'),
        });
        console.log(err)
      }
    });
  }

  fetchRooms() {
    this.isLoadingRooms.set(true);
    this.roomsService.getAllRooms({
      page: 1,
      size: 5,
    }).subscribe({
      next: (res: IRoomsResponse) => {
        this.roomList.set(res.data.rooms);
        this.totalRecords = res.data.totalCount;
        this.isLoadingRooms.set(false);
      },
      error: (err) => {
        this.isLoadingRooms.set(false);
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: err?.message || this.translate.instant('COMMON.SOMETHING_WENT_WRONG'),
        });
      }
    });
  }

  onSearch(payload: {
    startDate: string;
    endDate: string;
    capacity: number;
  }) {
    this.loadingSearch.set(true);
    this.roomsService.getAllRooms({
      page: 1,
      size: this.totalRecords,
      startDate: payload.startDate,
      endDate: payload.endDate,
    }).subscribe({
      next: (res: IRoomsResponse) => {
        const filtered = res.data.rooms.filter(
          room => !payload.capacity || room.capacity >= payload.capacity
        );
        this.roomList.set(filtered);
        this.loadingSearch.set(false);

        if (filtered.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: this.translate.instant('COMMON.NO_RESULTS'),
            detail: this.translate.instant('ROOMS.NO_ROOMS_MATCH') ,
          });
        }
      },
      error: (err) => {
        this.loadingSearch.set(false);
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR') || 'Error',
          detail: err?.message || this.translate.instant('COMMON.SOMETHING_WENT_WRONG'),
        });
      }
    });
  }

  //Get Rooms With Facilities
  housesWithGym = computed(() =>
    this.roomList().filter(room =>
      room.facilities.some(
        facility => facility._id === '6a3fa9b445ec37997cfad11c'
      )
    )
  );

  housesWithPackyard = computed(() =>
    this.roomList().filter(room =>
      room.facilities.some(
        facility => facility._id === '6a3ebb17766e99759771a16a'
      )
    )
  );

}
