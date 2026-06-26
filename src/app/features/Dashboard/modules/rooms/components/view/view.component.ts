import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomsService } from '../../services/rooms.service';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { DividerModule } from 'primeng/divider';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { IRoom } from '../../../../../../shared/interfaces/general.interface';

@Component({
  selector: 'app-view',
  imports: [
    SkeletonModule,
    TagModule,
    ButtonModule,
    GalleriaModule,
    DividerModule,
    RouterLink,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent implements OnInit {
  private readonly roomService = inject(RoomsService);
  private readonly route = inject(ActivatedRoute)

  roomId = signal<string>('');
  room = signal<IRoom | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.roomId.set(params['id']);
      this.getRoomDetails();
      //console.log(this.roomId);
    });
  }

  // Get Room Details
  getRoomDetails(): void {
    this.loading.set(true);

    this.roomService.getRoomDetails(this.roomId()).subscribe({
      next: (res) => {
        this.room.set(res.data.room);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  finalPrice(room: IRoom): number {
    return room.price - (room.price * room.discount) / 100;
  }
}
