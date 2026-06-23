import { Component, inject, signal } from '@angular/core';
import { RoomsService } from '../../services/rooms.service';
import { IRoom } from '../../interfaces/rooms.interface';
import { MenuItem, } from 'primeng/api';
import { Router } from '@angular/router';
import { AlertDeleteService } from '../../../../../../shared/services/alert-delete.service';
@Component({
  selector: 'app-room-list',
  imports: [],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss',
})
export class RoomListComponent {
  private readonly roomService = inject(RoomsService);
  private readonly router = inject(Router);
  
  //Esraa code
  rooms = signal<IRoom[]>([]);
  loading = signal<boolean>(false);
  readonly skeletonRows = Array(6).fill({});
  selectedMenuItems = signal<MenuItem[]>([]);

  ngOnInit() {
    this.getAllRooms();
  }

  openMenu(menu: any, event: Event, room: IRoom): void {
    this.selectedMenuItems.set([
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => this.viewRoom(room)
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteRoom(room)
      }
    ]);

    menu.toggle(event);
  }

  getAllRooms(): void {
    this.loading.set(true);

    this.roomService.getRooms().subscribe({
      next: (res) => {
        this.rooms.set(res.data.rooms);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
  //View Room Details
  viewRoom(room: IRoom): void {
    this.router.navigate(['/admin/rooms/view', room._id]);
  }

  //Delete Room
  private alertService = inject(AlertDeleteService);
  deleteRoom(room: IRoom) {
    this.alertService.delete({
      entity: 'ROOMS.ROOM',
      label: room.roomNumber,
      request: () => this.roomService.deleteRoom(room._id),
      onSuccess: () => this.getAllRooms(),
    });
  }
}
