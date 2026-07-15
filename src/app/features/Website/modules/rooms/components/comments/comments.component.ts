import { Component, ElementRef, inject, input, OnInit, signal, ViewChild } from '@angular/core';
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
import { RoleEnum } from '../../../../../../core/enums/role.enum';
import { Router } from '@angular/router';
import { ConfirmEventType } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-comments',
  imports: [FormsModule, ButtonModule, TextareaModule, ConfirmDialogModule, TranslatePipe, SkeletonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
  providers: [ConfirmationService],
})
export class CommentsComponent implements OnInit {
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
  isLoadingComments = signal<boolean>(false);
  comments = signal<RoomComment[]>([]);
  currentUserId = this.authService.getCurrentUserId();
  isEditing = signal<boolean>(false);
  editingCommentId = signal<string | null>(null);
  isUpdatingComment = signal<boolean>(false);
  isDeletingComment = signal<boolean>(false);

  ngOnInit() {
    if (this.authService.isLoggedIn() && this.authService.getRole() === RoleEnum.User) {
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
    if (!this.authService.isLoggedIn()) {
      this.showLoginRequiredDialog();
      return;
    }

    if (!this.commentText().trim()) return;

    if (this.isEditing() && this.editingCommentId()) {
      this.updateComment();
    } else {
      this.submitComment();
    }
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

  submitComment() {
    if (!this.commentText().trim()) return;

    this.isSubmitting.set(true);
    const typedCommentText = this.commentText();

    this.roomsService
      .createComment({
        roomId: this.roomId(),
        comment: typedCommentText,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.commentText.set('');

          const currentUserName = this.authService.getUserName() || 'You';
          const currentUserImage = this.authService.getUserImage() || undefined;

          const fallbackUser = {
            _id: this.currentUserId || '',
            userName: currentUserName,
            profileImage: currentUserImage,
          };

          const newComment: RoomComment = {
            _id: res.data?._id ,
            comment: typedCommentText,
            room: {
              _id: this.roomId(),
              roomNumber: '',
            },
            user:
              res.data?.user && typeof res.data.user === 'object' ? res.data.user : fallbackUser,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

         // this.loadComments();
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
    this.scrollToComment();
   // window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private scrollToComment() {
    setTimeout(() => {
      this.commentArea?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }
  updateComment() {
    const id = this.editingCommentId();
    if (!id) return;

    this.isSubmitting.set(true);
    const typedCommentText = this.commentText();

    this.isUpdatingComment.set(true);
    this.roomsService.updateComment(id, typedCommentText).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);

        // this.comments.update((list) =>
        //   list.map((c) =>
        //     c._id === id
        //       ? { ...c, comment: typedCommentText, updatedAt: new Date().toISOString() }
        //       : c,
        //   ),
        // );

       this.loadComments();

        this.cancelEdit();
        this.isUpdatingComment.set(false);
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('COMMON.SUCCESS'),
          detail: this.translate.instant('COMMENTS.UPDATE_SUCCESS'),
        });
      },
      error: (err: HttpErrorResponse) => {
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
        this.isDeletingComment.set(true);
        this.roomsService.removeComment(commentId).subscribe({
          next: () => {
            //this.comments.update((list) => list.filter((c) => c._id !== commentId));
            this.loadComments();
            if (this.editingCommentId() === commentId) {
              this.cancelEdit();
            }
            this.isDeletingComment.set(false);
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('COMMON.SUCCESS'),
              detail: this.translate.instant('COMMENTS.DELETE_SUCCESS'),
            });
          },
          error: () => {
            this.isDeletingComment.set(false);
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
