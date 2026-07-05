import { Component, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../../../shared/components/dashboard/ui/page-header/page-header.component';
import { RoomsService } from '../../services/rooms.service';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../../../../../shared/components/general/empty-state/empty-state.component';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { AlertDeleteService } from '../../../../../../shared/services/alert-delete.service';
import { TableSkeletonComponent } from '../../../../../../shared/components/dashboard/table-skeleton/table-skeleton.component';
import { CurrencyPipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Facility, IRoom } from '../../../../../../shared/interfaces/general.interface';
@Component({
  selector: 'app-room-list',
  imports: [
    TranslatePipe,
    DividerModule,
    PageHeaderComponent,
    TableModule,
    ButtonModule,
    MenuModule,
    FormsModule,
    RouterLink,
    EmptyStateComponent,
    Select,
    Paginator,
    TableSkeletonComponent,
    CurrencyPipe,
  ],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss',
})
export class RoomListComponent {
  private roomsService = inject(RoomsService);
  private alertService = inject(AlertDeleteService);
  private translate = inject(TranslateService);

  rooms = signal<IRoom[]>([]);
  allRooms: IRoom[] = [];
  isLoading = signal<boolean>(true);
  searchTerm: string = '';
  selectedTag: number | null = null;
  selectedFacility: string | null = null;
  facilities = signal<Facility[]>([]);
  tags = signal<{ label: string; value: number }[]>([]);
  filteredRooms: IRoom[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  ngOnInit(): void {
    this.loadRooms();
    this.loadFacilities();
  }

  loadRooms() {
    this.isLoading.set(true);
    this.roomsService.getAllRooms({ page: 1, size: 1000 }).subscribe({
      next: (res) => {
        this.allRooms = res.data.rooms;
        this.rooms.set(res.data.rooms);
        this.totalRecords = res.data.totalCount;

        const uniqueCapacities = [...new Set(res.data.rooms.map((r) => r.capacity))];
        this.tags.set(uniqueCapacities.map((c) => ({ label: c.toString(), value: c })));

        this.applyFilter();
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  loadFacilities() {
    this.roomsService.getAllFacilities().subscribe({
      next: (res) => this.facilities.set(res.data.facilities),
    });
  }

  filterRooms(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    const filtered = this.allRooms.filter((room) => {
      const matchSearch = room.roomNumber.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchTag = this.selectedTag ? room.capacity === this.selectedTag : true;
      const matchFacility = this.selectedFacility
        ? room.facilities.some((f) => f._id === this.selectedFacility)
        : true;

      return matchSearch && matchTag && matchFacility;
    });

    this.totalRecords = filtered.length;
    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredRooms = filtered.slice(start, start + this.pageSize);
  }

  onPageChange(event: PaginatorState) {
    this.currentPage = (event.page ?? 0) + 1;
    this.pageSize = event.rows ?? 10;
    this.applyFilter();
  }

  toggleRoomActions(selectedRoom: any): void {
    this.rooms().forEach((room) => {
      (room as any).showActions = false;
    });
    if (selectedRoom) {
      selectedRoom.showActions = !selectedRoom.showActions;
    }
  }

  //Delete Room
  deleteRoom(room: IRoom) {
    this.alertService.delete({
      entity: this.translate.instant('ROOMS.ROOM'),
      label: room.roomNumber,
      request: () => this.roomsService.deleteRoom(room._id),
      onSuccess: () => this.loadRooms(),
    });
  }
}
