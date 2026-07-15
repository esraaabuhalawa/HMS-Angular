import { Component, inject, input, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { switchMap, map, tap, finalize } from 'rxjs/operators';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { RoomsService } from '../../services/rooms.service';
import { AuthService } from '../../../../../Auth/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RoomComment } from '../../interfaces/rooms.interface';
import { Skeleton } from 'primeng/skeleton';
import { TranslatePipe } from '@ngx-translate/core';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonDirective } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  imports: [FormsModule, Skeleton, TranslatePipe, ConfirmDialog, ButtonDirective, TextareaModule],
  providers: [ConfirmationService],
})
export class CommentsComponent {
  @ViewChild('commentArea') commentArea?: ElementRef<HTMLElement>;

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private readonly roomsService = inject(RoomsService);
  private readonly authService = inject(AuthService);
  private translate = inject(TranslateService);
  private router = inject(Router);

  roomId = input.required<string>();
  showComments = signal<boolean>(false);
  commentText = signal<string>('');
  isSubmitting = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  editingCommentId = signal<string | null>(null);
  currentUserId = this.authService.getCurrentUserId();

  isLoadingComments = signal<boolean>(false);
  isDeletingComment = signal<string | null>(null);

  //locally refresh
  private refreshComments$ = new BehaviorSubject<void>(undefined);

  comments = toSignal(
    // compare roomId & refreshComments$
    combineLatest([toObservable(this.roomId), this.refreshComments$]).pipe(
      tap(() => this.isLoadingComments.set(true)),
      switchMap(([id]) =>
        this.roomsService
          .getAllComments(id)
          .pipe(finalize(() => this.isLoadingComments.set(false))),
      ),
      map((res: any) => res.data.roomComments),
    ),
    { initialValue: [] as RoomComment[] },
  );

  canSubmit = computed(() => this.commentText().trim().length > 0 && !this.isSubmitting());

  handleCommentSubmit() {
    if (!this.authService.isLoggedIn()) {
      this.showLoginRequiredDialog();
      return;
    }

    const text = this.commentText().trim();
    if (!text) return;

    this.isSubmitting.set(true);

    const request$ =
      this.isEditing() && this.editingCommentId()
        ? this.roomsService.updateComment(this.editingCommentId()!, text)
        : this.roomsService.createComment({ roomId: this.roomId(), comment: text });

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.commentText.set('');
        this.cancelEdit();
        this.refreshComments$.next();
        this.showToast(
          'success',
          'COMMON.SUCCESS',
          this.isEditing() ? 'COMMENTS.UPDATE_SUCCESS' : 'COMMENTS.SUBMIT_SUCCESS',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.showToast('error', 'COMMON.ERROR', err.error?.message ?? 'COMMENTS.SUBMIT_ERROR');
      },
    });
  }

  deleteComment(commentId: string) {
    this.confirmationService.confirm({
      message: this.translate.instant('COMMENTS.DELETE_CONFIRM_MESSAGE'),
      header: this.translate.instant('COMMENTS.DELETE_CONFIRM_TITLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.isDeletingComment.set(commentId);

        this.roomsService.removeComment(commentId).subscribe({
          next: () => {
            this.refreshComments$.next();
            if (this.editingCommentId() === commentId) {
              this.cancelEdit();
            }
            this.isDeletingComment.set(null);
            this.showToast('success', 'COMMON.SUCCESS', 'COMMENTS.DELETE_SUCCESS');
          },
          error: () => {
            this.isDeletingComment.set(null);
            this.showToast('error', 'COMMON.ERROR', 'COMMENTS.DELETE_ERROR');
          },
        });
      },
    });
  }

  editComment(item: RoomComment) {
    this.isEditing.set(true);
    this.editingCommentId.set(item._id);
    this.commentText.set(item.comment);
    this.scrollToComment();
  }

  private scrollToComment() {
    setTimeout(() => {
      this.commentArea?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editingCommentId.set(null);
    this.commentText.set('');
  }

  showLoginRequiredDialog() {
    this.confirmationService.confirm({
      message: this.translate.instant('COMMENTS.LOGIN_REQUIRED_MESSAGE'),
      header: this.translate.instant('COMMENTS.LOGIN_REQUIRED_TITLE'),
      icon: 'pi pi-user',
      acceptLabel: this.translate.instant('COMMENTS.LOGIN_BUTTON'),
      rejectLabel: this.translate.instant('COMMENTS.REGISTER_BUTTON'),
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => this.router.navigate(['/auth/login']),
      reject: (type: ConfirmEventType) => {
        if (type === ConfirmEventType.REJECT) {
          this.router.navigate(['/auth/register']);
        }
      },
    });
  }

  toggleComments() {
    this.showComments.update((v) => !v);
  }

  //Helper Function
  private showToast(severity: 'success' | 'error', summaryKey: string, detailKey: string) {
    this.messageService.add({
      severity,
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(detailKey),
    });
  }
}
