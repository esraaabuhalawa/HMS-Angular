import { Component, inject, signal } from '@angular/core';
import { AdCardComponent } from '../../../../shared/components/website/ui/ad-card/ad-card.component';
import { HeroSectionComponent } from '../../../../shared/components/website/home/hero-section/hero-section.component';
import { RoomCardComponent } from "../../../../shared/components/website/ui/room-card/room-card.component";
import { CustomersSectionComponent } from '../../../../shared/components/website/home/customers-section/customers-section.component';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { IAd, IAdsResponse } from '../../../Dashboard/modules/Ads/interfaces/ads.interface';
import { AdsService } from '../../services/ads.service';
import { IRoom } from '../../../../shared/interfaces/general.interface';
import { RoomsService } from '../../modules/rooms/services/rooms.service';
import { IRoomsResponse } from '../../modules/rooms/interfaces/rooms.interface';

@Component({
  selector: 'app-home',
  imports: [AdCardComponent, HeroSectionComponent, RoomCardComponent,
    CustomersSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private adsService = inject(AdsService);
  private roomsService = inject(RoomsService);
  private readonly messageService = inject(MessageService);
  private translate = inject(TranslateService);
  isLoading = signal<boolean>(true);
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  adsList = signal<IAd[]>([]);
  roomList = signal<IRoom[]>([]);

  ngOnInit(): void {
    this.fetchAdsData();
    this.loadRooms()
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
  loadRooms() {
    this.isLoading.set(true);
    this.roomsService.getAllRooms({ page: this.currentPage, size: 4 }).subscribe({
      next: (res: IRoomsResponse) => {
        this.roomList.set(res.data.rooms);
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

}
