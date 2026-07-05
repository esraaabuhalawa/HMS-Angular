import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { FacilitiesService } from '../../services/facilities.service';
import { PageHeaderComponent } from '../../../../../../shared/components/dashboard/ui/page-header/page-header.component';
import { TableSkeletonComponent } from '../../../../../../shared/components/dashboard/table-skeleton/table-skeleton.component';
import { EmptyStateComponent } from '../../../../../../shared/components/general/empty-state/empty-state.component';
import { TableModule } from 'primeng/table';
import { Menu } from 'primeng/menu';
import { Button } from 'primeng/button';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { IFacility, IFacilityResponse } from '../../interfaces/facilities.interface';
import { AlertDeleteService } from '../../../../../../shared/services/alert-delete.service';
import { MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ViewFacilityComponent } from '../view-facility/view-facility.component';
import { AddEditComponent } from '../add-edit-facility/add-edit-facility.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SkeletonColumn } from '../../../../../../shared/components/dashboard/table-skeleton/table-skeleton.component';

@Component({
  selector: 'app-facility-list',
  imports: [
    PageHeaderComponent,
    TableSkeletonComponent,
    EmptyStateComponent,
    TableModule,
    Menu,
    Button,
    Paginator,
    DatePipe,
    ViewFacilityComponent,
    AddEditComponent,
    TranslatePipe,
  ],
  templateUrl: './facility-list.component.html',
  styleUrl: './facility-list.component.scss',
})
export class FacilityListComponent implements OnInit {
  private facilitiesService = inject(FacilitiesService);
  private alertService = inject(AlertDeleteService);
  private translate = inject(TranslateService);

  facilityList = signal<IFacility[]>([]);
  isLoading = signal<boolean>(true);
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  menuItems: MenuItem[] = [];
  selectedFacility = signal<IFacility | null>(null);
  selectedFacilityForEdit = signal<IFacility | null>(null);
  facilityLoading = signal(false);
  visible = signal(false);
  showDialog = signal(false);

  skeletonColumns = computed<SkeletonColumn[]>(() => [
    { header: this.translate.instant('FACILITIES.NAME') },
    { header: this.translate.instant('FACILITIES.CREATED_BY') },
    { header: this.translate.instant('FACILITIES.CREATED_AT') },
    { header: this.translate.instant('FACILITIES.UPDATED_AT') },
    {
      header: '',
      shape: 'circle',
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '10px',
    },
  ]);
  openMenu(event: Event, facility: IFacility, menu: any) {
    this.menuItems = [
      {
        label: this.translate.instant('FACILITIES.MENU.VIEW'),
        icon: 'pi pi-eye',
        command: () => this.viewFacility(facility),
      },
      {
        label: this.translate.instant('FACILITIES.MENU.EDIT'),
        icon: 'pi pi-pencil',
        command: () => this.updateFacility(facility),
      },
      {
        label: this.translate.instant('FACILITIES.MENU.DELETE'),
        icon: 'pi pi-trash',
        command: () => this.deleteFacility(facility),
      },
    ];
    menu.toggle(event);
  }

  ngOnInit(): void {
    this.loadFacilityData();
  }

  loadFacilityData() {
    this.isLoading.set(true);
    this.facilitiesService
      .getAllFacilities({ page: this.currentPage, size: this.pageSize })
      .subscribe({
        next: (res: IFacilityResponse) => {
          this.facilityList.set(res.data.facilities);
          this.totalRecords = res.data.totalCount;
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  viewFacility(facility: IFacility) {
    this.selectedFacility.set(null);
    this.facilityLoading.set(true);
    this.visible.set(true);

    this.facilitiesService.getFacilityDetails(facility._id).subscribe({
      next: (res) => {
        this.selectedFacility.set(res.data.facility);
        this.facilityLoading.set(false);
      },
      error: () => {
        this.facilityLoading.set(false);
        this.visible.set(false);
      },
    });
  }

  deleteFacility(facility: IFacility) {
    this.alertService.delete({
      entity: this.translate.instant('FACILITIES.DELETE_ENTITY'),
      label: facility.name,
      request: () => this.facilitiesService.deleteFaciliy(facility._id),
      onSuccess: () => this.loadFacilityData(),
    });
  }
  updateFacility(facility: IFacility) {
    this.selectedFacilityForEdit.set(facility);
    this.showDialog.set(true);
  }
  onPageChange(event: PaginatorState) {
    this.currentPage = (event.page ?? 0) + 1;
    this.pageSize = event.rows ?? 10;
    this.loadFacilityData();
  }
}
