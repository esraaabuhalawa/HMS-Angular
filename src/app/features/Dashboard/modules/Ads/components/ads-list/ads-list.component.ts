import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Menu, MenuModule } from 'primeng/menu';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { PageHeaderComponent } from '../../../../../../shared/components/dashboard/ui/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../../../shared/components/general/empty-state/empty-state.component';
import { IAd, IAdsResponse } from '../../interfaces/ads.interface';
import { AdsService } from '../../services/ads.service';
import { AlertDeleteService } from '../../../../../../shared/services/alert-delete.service';
import { MenuItem } from 'primeng/api';
import { CurrencyPipe } from '@angular/common';
import { TableSkeletonComponent } from '../../../../../../shared/components/dashboard/table-skeleton/table-skeleton.component';
import { ViewAdComponent } from "../view-ad/view-ad.component";
import { AddEditComponent } from "../add-edit/add-edit.component";

@Component({
  selector: 'app-ads-list',
  imports: [
    DividerModule,
    PageHeaderComponent,
    TableModule,
    ButtonModule,
    MenuModule,
    FormsModule,
    EmptyStateComponent,
    Paginator,
    Menu, Button,
    TableSkeletonComponent,
    ViewAdComponent,
    CurrencyPipe,
    AddEditComponent
  ],
  templateUrl: './ads-list.component.html',
  styleUrl: './ads-list.component.scss',
})
export class AdsListComponent {
  private adsService = inject(AdsService);
  private alertService = inject(AlertDeleteService);

  adsList = signal<IAd[]>([]);
  isLoading = signal<boolean>(true);
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  selectedAd = signal<IAd | null>(null);
  adLoading = signal(false);
  visible = signal(false);
  menuItems: MenuItem[] = [];
  showDialog = false;

  openMenu(event: Event, ad: any, menu: any) {
    this.menuItems = [
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => this.viewAd(ad)
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editAd(ad)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteAd(ad)
      }
    ];
    menu.toggle(event);
  }

  ngOnInit(): void {
    this.loadAdsData();
  }

  loadAdsData() {
    this.isLoading.set(true);
    this.adsService.getAllAds({ page: this.currentPage, size: this.pageSize }).subscribe({
      next: (res: IAdsResponse) => {
        this.adsList.set(res.data.ads);
        this.totalRecords = res.data.totalCount;
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  viewAd(ad: IAd) {
    this.selectedAd.set(null);
    this.adLoading.set(true);
    this.visible.set(true);

    this.adsService.getAdDetails(ad._id).subscribe({
      next: (res) => {
        this.selectedAd.set(res.data.ads);
        this.adLoading.set(false);
      },
      error: () => {
        this.adLoading.set(false);
        this.visible.set(false);
      }
    });
  }

  editAd(ad: any): void {
    console.log('edit Clicked', ad);
    this.selectedAd.set(ad)
    this.showDialog = true;
  }

  //Delete Room
  deleteAd(ad: IAd) {
    console.log('Delete Clicked', ad);
    this.alertService.delete({
      entity: 'ad for Room',
      label: ad.room.roomNumber,
      request: () => this.adsService.deleteAd(ad._id),
      onSuccess: () => this.loadAdsData(),
    });
  }
   openAddDialog() {
    this.selectedAd.set(null)
    this.showDialog = true;
  }

  saveAd(data: any) {
    const ad = this.selectedAd();
    if (ad) {
      this.adsService.updateAd(ad._id, data)
        .subscribe(() => {
          this.showDialog = false;
          this.loadAdsData();
        });
    }
    else {
      this.adsService.createAd(data)
        .subscribe(() => {
          this.showDialog = false;
          this.loadAdsData();
        });
    }
  }

  //Helper Functions
  onPageChange(event: PaginatorState) {
    this.currentPage = (event.page ?? 0) + 1;
    this.pageSize = event.rows ?? 10;
    this.loadAdsData()
  }
}
