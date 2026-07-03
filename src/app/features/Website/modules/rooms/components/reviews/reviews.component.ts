import { Component, signal, input, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { RoomsService } from '../../services/rooms.service';
import { RoomReview } from '../../interfaces/rooms.interface';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../../Auth/services/auth.service';
import { RoleEnum } from '../../../../../../core/enums/role.enum';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [FormsModule, ButtonModule, TextareaModule, TranslatePipe, ConfirmDialog],
  templateUrl: './reviews.component.html',
  providers: [ConfirmationService],
})
export class ReviewsComponent implements OnInit {
  private roomsService = inject(RoomsService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  roomId = input.required<string>();

  stars = [1, 2, 3, 4, 5];
  ratingValue = signal<number>(3.5);
  message = signal<string>('');
  isSubmitting = signal<boolean>(false);

  reviews = signal<RoomReview[]>([]);
  isLoadingReviews = signal<boolean>(false);
  showReviews = signal<boolean>(false);

  ngOnInit() {
    if (this.authService.isLoggedIn() && this.authService.getRole() === RoleEnum.User) {
      this.loadReviews();
    }
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
    if (!this.authService.isLoggedIn()) {
      this.showLoginRequiredDialog();
      return;
    }

    this.isSubmitting.set(true);

    const currentMessage = this.message();
    const currentRating = this.ratingValue();

    this.roomsService
      .createReview({
        roomId: this.roomId(),
        rating: currentRating,
        review: currentMessage,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);

          const newReview = {
            _id: res.data?._id || new Date().getTime().toString(),
            rating: currentRating,
            review: currentMessage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            room: this.roomId(),
            user: {
              _id: '',
              userName: 'You',
              profileImage: null,
            },
          } as any;

          this.message.set('');
          this.ratingValue.set(3.5);
          this.reviews.update((list) => [newReview, ...list]);

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

  showLoginRequiredDialog() {
    this.confirmationService.confirm({
      message: this.translate.instant('REVIEWS.LOGIN_REQUIRED_MESSAGE'),
      header: this.translate.instant('REVIEWS.LOGIN_REQUIRED_TITLE'),
      icon: 'pi pi-user',
      acceptLabel: this.translate.instant('REVIEWS.LOGIN_BUTTON'),
      rejectLabel: this.translate.instant('REVIEWS.REGISTER_BUTTON'),
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this.router.navigate(['/auth/login']);
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.router.navigate(['/auth/register']);
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      },
    });
  }
}
