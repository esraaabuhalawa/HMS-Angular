import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Menu, MenuModule } from 'primeng/menu';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { PageHeaderComponent } from '../../../../../../shared/components/dashboard/ui/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../../../shared/components/general/empty-state/empty-state.component';
import { IAd, IAdsResponse, ICreateAdData, IUpdateAdData } from '../../interfaces/ads.interface';
import { AdsService } from '../../services/ads.service';
import { AlertDeleteService } from '../../../../../../shared/services/alert-delete.service';
import { MenuItem, MessageService } from 'primeng/api';
import { CurrencyPipe } from '@angular/common';
import { TableSkeletonComponent } from '../../../../../../shared/components/dashboard/table-skeleton/table-skeleton.component';
import { ViewAdComponent } from "../view-ad/view-ad.component";
import { AddEditAdsComponent } from "../add-edit-ads/add-edit-ads.component";
import { finalize } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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
    AddEditAdsComponent,
    TranslatePipe
  ],
  templateUrl: './ads-list.component.html',
  styleUrl: './ads-list.component.scss',
})
export class AdsListComponent {
  private adsService = inject(AdsService);
  private alertService = inject(AlertDeleteService);
  private readonly messageService = inject(MessageService);
  private translate = inject(TranslateService);

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
  addEditLoad = signal(false);

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
        command: () => this.openEditDialog(ad)
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
    this.fetchAdsData();
  }

  fetchAdsData() {
    this.isLoading.set(true);
    this.adsService.getAllAds({ page: this.currentPage, size: this.pageSize }).subscribe({
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

  openEditDialog(ad: IAd): void {
    this.selectedAd.set(ad)
    this.showDialog = true;
  }

  openAddDialog() {
    this.selectedAd.set(null)
    this.showDialog = true;
  }

  //Emit Add And Edit requests to Dialog
  saveAd(data: ICreateAdData | IUpdateAdData) {
    this.addEditLoad.set(true);
    const isEdit = !!this.selectedAd();
    const request$ = isEdit
      ? this.adsService.updateAd(this.selectedAd()!._id, data as IUpdateAdData)
      : this.adsService.createAd(data as ICreateAdData);

    request$.pipe(
      finalize(() => this.addEditLoad.set(false))
    ).subscribe({
      next: () => {
        this.showDialog = false;
        this.fetchAdsData();
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('COMMON.SUCCESS'),
          detail: this.translate.instant(isEdit ? 'ADS.UPDATE_SUCCESS' : 'ADS.CREATE_SUCCESS'),
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: err.message || this.translate.instant('COMMON.SOMETHING_WENT_WRONG'),
        });
        console.error(err);
      }
    });
  }

  //Delete Room
  deleteAd(ad: IAd) {
    this.alertService.delete({
      entity: 'ADS.TITLE',
      label: ad.room.roomNumber,
      request: () => this.adsService.deleteAd(ad._id),
      onSuccess: () => this.fetchAdsData(),
    });
  }

  //Helper Functions
  onPageChange(event: PaginatorState) {
    this.currentPage = (event.page ?? 0) + 1;
    this.pageSize = event.rows ?? 10;
    this.fetchAdsData()
  }
}
