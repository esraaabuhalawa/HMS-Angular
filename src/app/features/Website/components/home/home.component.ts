import { Component, computed, inject, signal } from '@angular/core';
import { HeroSectionComponent } from '../../../../shared/components/website/home/hero-section/hero-section.component';
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
import { FacilityEnum } from '../../../../core/enums/facility.enum';
import { finalize } from 'rxjs';
import { HomeCommonCardComponent } from "../../../../shared/components/website/ui/home-common-card/home-common-card.component";

@Component({
  selector: 'app-home',
  imports: [HeroSectionComponent, RoomInfoCardComponent,
    CustomersSectionComponent, CardSkeltonComponent,  TranslatePipe, HomeCommonCardComponent],
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
  totalRecords: number = 0;
  totalRoomsRecords: number = 0;
  adsList = signal<IAd[]>([]);
  allRoomsList = signal<IRoom[]>([]);
  ngOnInit(): void {
    this.fetchAdsData();
    this.fetchAllRooms();
  }

  fetchAdsData() {
    this.isLoading.set(true);
    this.adsService.getAllAds({ page: this.currentPage, size: 4 })
    .pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: (res: IAdsResponse) => {
        this.adsList.set(res.data.ads);
      },
      error: (err) => { this.showError(err); }
    });
  }

  fetchAllRooms() {
    this.isLoadingRooms.set(true);
    this.roomsService.getAllRoomsLocally().pipe(
      finalize(() => this.isLoadingRooms.set(false))).subscribe({
      next: (res: IRoomsResponse) => {
        this.allRoomsList.set(res.data.rooms);
        this.totalRecords = res.data.totalCount;
      },
      error: (err) => { this.showError(err); }
    });
  }

  onSearch(payload: {
    startDate: string;
    endDate: string;
    capacity: number;}) {
    this.loadingSearch.set(true);
    this.roomsService.getAllRooms({page: 1,size: this.totalRecords,
      startDate: payload.startDate,
      endDate: payload.endDate,
    }).pipe(finalize(() =>
      this.loadingSearch.set(false))
    ).subscribe({
      next: (res: IRoomsResponse) => {
        const filtered = res.data.rooms.filter(
          room => !payload.capacity || room.capacity >= payload.capacity
        );
        this.allRoomsList.set(filtered);

        if (filtered.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: this.translate.instant('COMMON.NO_RESULTS'),
            detail: this.translate.instant('ROOMS.NO_ROOMS_MATCH'),
          });
        }
      },
      error: (err) => { this.showError(err); }
    });
  }

  private showError(err: any) {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('COMMON.ERROR'),
      detail: err?.message || this.translate.instant('COMMON.SOMETHING_WENT_WRONG'),
    });
  }

  housesWithGym = computed(() =>
    this.allRoomsList().filter(room =>
      room.facilities.some(facility => facility.name.toLowerCase() === FacilityEnum.Gym)
    )
  );

  housesWithPackyard = computed(() =>
    this.allRoomsList().filter(room =>
      room.facilities.some(facility => facility.name.toLowerCase() === FacilityEnum.Backyard)
    )
  );
}
