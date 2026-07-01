import { inject, Injectable } from '@angular/core';
import {
  CreateCommentRequest,
  CreateCommentResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  GetCommentsResponse,
  GetRoomReviewsResponse,
  IRoomDetailResponse,
  IRoomsResponse,
  RoomParams,
} from '../interfaces/rooms.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private http = inject(HttpClient);

  getAllRooms(paramsData: RoomParams): Observable<IRoomsResponse> {
    let params = new HttpParams()
      .set('page', paramsData.page.toString())
      .set('size', paramsData.size.toString());

    if (paramsData.startDate) {
      params = params.set('startDate', paramsData.startDate);
    }
    if (paramsData.endDate) {
      params = params.set('endDate', paramsData.endDate);
    }
    return this.http.get<IRoomsResponse>('portal/rooms/available', { params });
  }

  //To get Data for Local
  getAllRoomsLocally(): Observable<IRoomsResponse> {
    return this.getAllRooms({ page: 1, size: 1 }).pipe(
      switchMap((res) => {
        const total = res.data.totalCount;

        if (total <= 1) {
          return of(res); // already have everything, skip second call
        }

        return this.getAllRooms({ page: 1, size: total });
      }),
    );
  }

  getRoomDetails(id: string): Observable<IRoomDetailResponse> {
    return this.http.get<IRoomDetailResponse>(`portal/rooms/${id}`);
  }
  // Review
  getAllReviews(roomId: string): Observable<GetRoomReviewsResponse> {
    return this.http.get<GetRoomReviewsResponse>(`portal/room-reviews/${roomId}`);
  }

  createReview(payload: CreateReviewRequest): Observable<CreateReviewResponse> {
    return this.http.post<CreateReviewResponse>('portal/room-reviews', payload);
  }

  // comments
  getAllComments(roomId: string): Observable<GetCommentsResponse> {
    return this.http.get<GetCommentsResponse>(`portal/room-comments/${roomId}`);
  }

  createComment(payload: CreateCommentRequest): Observable<CreateCommentResponse> {
    return this.http.post<CreateCommentResponse>('portal/room-comments', payload);
  }

  removeComment(commentId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `portal/room-comments/${commentId}`,
    );
  }

  updateComment(commentId: string, comment: string): Observable<CreateCommentResponse> {
    return this.http.patch<CreateCommentResponse>(`portal/room-comments/${commentId}`, { comment });
  }
}
