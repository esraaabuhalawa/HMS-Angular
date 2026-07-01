import { Component, signal, input, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { RoomsService } from '../../services/rooms.service';
import { RoomReview } from '../../interfaces/rooms.interface';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [FormsModule, ButtonModule, TextareaModule, TranslatePipe],
  templateUrl: './reviews.component.html',
})
export class ReviewsComponent implements OnInit {
  private roomsService = inject(RoomsService);
  private messageService = inject(MessageService);

  private translate = inject(TranslateService);

  roomId = input.required<string>();

  stars = [1, 2, 3, 4, 5];
  ratingValue = signal<number>(3.5);
  message = signal<string>('');
  isSubmitting = signal<boolean>(false);

  reviews = signal<RoomReview[]>([]);
  isLoadingReviews = signal<boolean>(false);
  showReviews = signal<boolean>(false);

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.isLoadingReviews.set(true);
    this.roomsService.getAllReviews(this.roomId()).subscribe({
      next: (res) => {
        this.reviews.set(res.data.roomReviews);
        this.isLoadingReviews.set(false);
      },
      error: () => {
        this.isLoadingReviews.set(false);
      },
    });
  }

  toggleReviews() {
    this.showReviews.update((v) => !v);
  }

  getIcon(star: number) {
    const value = this.ratingValue();
    if (value >= star) return 'pi-star-fill';
    if (value >= star - 0.5) return 'pi-star-half-fill';
    return 'pi-star';
  }

  onStarClick(event: MouseEvent, star: number) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;

    this.ratingValue.set(isHalf ? star - 0.5 : star);
  }

  submitRate() {
    this.isSubmitting.set(true);

    this.roomsService
      .createReview({
        roomId: this.roomId(),
        rating: this.ratingValue(),
        review: this.message(),
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.message.set('');
          this.ratingValue.set(0);
          this.reviews.update((list) => [res.data, ...list]);
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('COMMON.SUCCESS'),
            detail: this.translate.instant('REVIEWS.SUBMIT_SUCCESS'),
          });
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: err.error?.message ?? this.translate.instant('REVIEWS.SUBMIT_ERROR'),
          });
        },
      });
  }
}
