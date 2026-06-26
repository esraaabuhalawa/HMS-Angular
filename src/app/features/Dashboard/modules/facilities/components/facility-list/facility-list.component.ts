import { Component, inject, signal } from '@angular/core';
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
  ],
  templateUrl: './facility-list.component.html',
  styleUrl: './facility-list.component.scss',
})
export class FacilityListComponent {
  private facilitiesService = inject(FacilitiesService);
  private alertService = inject(AlertDeleteService);

  facilityList = signal<IFacility[]>([]);
  isLoading = signal<boolean>(true);
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  menuItems: MenuItem[] = [];
  selectedFacility = signal<IFacility | null>(null);
  facilityLoading = signal(false);
  visible = signal(false);
  showDialog = false;

  openMenu(event: Event, facility: any, menu: any) {
    this.menuItems = [
      {
        label: 'View',
        icon: 'pi pi-eye',
        //command: () => this.viewFacility(facility)
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        //    command: () => this.editFacility(facility)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        //   command: () => this.deleteFacility(facility)
      },
    ];
    menu.toggle(event);
  }

  ngOnInit(): void {
    this.loadFacilityData();
  }

  loadFacilityData() {
    this.isLoading.set(true);
    this.facilitiesService.getAllFacilities().subscribe({
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
        this.selectedFacility.set(res.data.facilities);
        this.facilityLoading.set(false);
      },
      error: () => {
        this.facilityLoading.set(false);
        this.visible.set(false);
      },
    });
  }

  onPageChange(event: PaginatorState) {
    this.currentPage = (event.page ?? 0) + 1;
    this.pageSize = event.rows ?? 10;
    this.loadFacilityData();
  }
}
