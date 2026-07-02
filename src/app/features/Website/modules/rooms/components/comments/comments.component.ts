import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RoomsService } from '../../services/rooms.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RoomComment } from '../../interfaces/rooms.interface';
import { AuthService } from '../../../../../Auth/services/auth.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-comments',
  imports: [FormsModule, ButtonModule, TextareaModule, ConfirmDialogModule, TranslatePipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
  providers: [ConfirmationService],
})
export class CommentsComponent implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private readonly roomsService = inject(RoomsService);
  private readonly authService = inject(AuthService);
  private translate = inject(TranslateService);
  roomId = input.required<string>();
  showComments = signal<boolean>(false);
  commentText = signal<string>('');
  isSubmitting = signal<boolean>(false);
  isLoadingComments = signal<boolean>(false);
  comments = signal<RoomComment[]>([]);
  currentUserId = this.authService.getCurrentUserId();
  isEditing = signal<boolean>(false);
  editingCommentId = signal<string | null>(null);

  ngOnInit() {
    if( this.authService.isLoggedIn()){
      this.loadComments();
    }
  }

  loadComments() {
    this.isLoadingComments.set(true);
    this.roomsService.getAllComments(this.roomId()).subscribe({
      next: (res) => {
        this.comments.set(res.data.roomComments);
        this.isLoadingComments.set(false);
      },
      error: () => {
        this.isLoadingComments.set(false);
      },
    });
  }

  handleCommentSubmit() {
    if (!this.commentText().trim()) return;

    if (this.isEditing() && this.editingCommentId()) {
      this.updateComment();
    } else {
      this.submitComment();
    }
  }

  submitComment() {
    this.isSubmitting.set(true);
    this.roomsService
      .createComment({
        roomId: this.roomId(),
        comment: this.commentText(),
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.commentText.set('');

          const fallbackUser =
            this.comments().length > 0
              ? this.comments()[0].user
              : { _id: '', userName: 'You', profileImage: undefined };

          const newComment: RoomComment = {
            ...res.data,
            user: res.data.user && typeof res.data.user === 'object' ? res.data.user : fallbackUser,
          };

          this.comments.update((list) => [newComment, ...list]);

          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('COMMON.SUCCESS'),
            detail: this.translate.instant('COMMENTS.SUBMIT_SUCCESS'),
          });
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: err.error?.message ?? this.translate.instant('COMMENTS.SUBMIT_ERROR'),
          });
        },
      });
  }
  editComment(item: RoomComment) {
    this.isEditing.set(true);
    this.editingCommentId.set(item._id);
    this.commentText.set(item.comment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // updateComment() {
  //   const id = this.editingCommentId();
  //   if (!id) return;

  //   this.isSubmitting.set(true);
  //   this.roomsService.updateComment(id, this.commentText()).subscribe({
  //     next: (res) => {
  //       this.isSubmitting.set(false);

  //       this.comments.update((list) =>
  //         list.map((c) => (c._id === id ? { ...c, comment: this.commentText() } : c)),
  //       );

  //       this.cancelEdit();
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Your comment has been updated successfully',
  //       });
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       this.isSubmitting.set(false);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: err.error?.message ?? 'Failed to update comment',
  //       });
  //     },
  //   });
  // }

  updateComment() {
    const id = this.editingCommentId();
    if (!id) return;

    this.isSubmitting.set(true);
    this.roomsService.updateComment(id, this.commentText()).subscribe({
      next: (res) => {
        console.log('Update Response:', res);

        this.isSubmitting.set(false);
        this.loadComments();
        this.cancelEdit();
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('COMMON.SUCCESS'),
          detail: this.translate.instant('COMMENTS.UPDATE_SUCCESS'),
        });
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);

        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('COMMON.ERROR'),
          detail: err.error?.message ?? this.translate.instant('COMMENTS.UPDATE_ERROR'),
        });
      },
    });
  }
  cancelEdit() {
    this.isEditing.set(false);
    this.editingCommentId.set(null);
    this.commentText.set('');
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
        this.roomsService.removeComment(commentId).subscribe({
          next: () => {
            this.comments.update((list) => list.filter((c) => c._id !== commentId));

            if (this.editingCommentId() === commentId) {
              this.cancelEdit();
            }

            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('COMMON.SUCCESS'),
              detail: this.translate.instant('COMMENTS.DELETE_SUCCESS'),
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: this.translate.instant('COMMON.ERROR'),
              detail: this.translate.instant('COMMENTS.DELETE_ERROR'),
            });
          },
        });
      },
    });
  }

  toggleComments() {
    this.showComments.update((v) => !v);
  }
}
