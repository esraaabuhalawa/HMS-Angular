import { inject, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ConfirmDeleteConfig } from '../interfaces/confirm-delete-config.interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AlertDeleteService {
  private readonly translate = inject(TranslateService);

  delete<T>(config: ConfirmDeleteConfig<T>) {
    const entity = this.translate.instant(config.entity);
    Swal.fire({
      imageUrl: '/images/delete-icon.png',
      imageWidth: 128,
      imageHeight: 128,
      imageAlt: 'Delete warning',
      showCloseButton: true,
      title: this.translate.instant('ALERTS.DELETE_TITLE', { entity: entity }),
      html: config.html ?? `${this.translate.instant('ALERTS.DELETE_MESSAGE')}
            <strong class='text-red-500'> ${entity} ${config.label ?? ''}</strong>`,
      text: config.text ?? this.translate.instant('ALERTS.DELETE_WARNING'),
      showCancelButton: false,
      confirmButtonText: config.confirmButtonText ?? this.translate.instant('ALERTS.DELETE_CONFIRM'),
      cancelButtonText: this.translate.instant('ALERTS.DELETE_CANCEL'),
      confirmButtonColor: '#e11d48',
    }).then(result => {

      if (!result.isConfirmed) return;

      config.request().subscribe({
        next: (res) => {

          Swal.fire({
            icon: 'success',
            title: this.translate.instant('ALERTS.DELETE_SUCCESSFULLY'),
            html: config.label ? `<b class='text-green-500'>${config.label}</b> ${this.translate.instant('ALERTS.DELETE_SUCCESSFULLY')} ` : undefined,
            timer: 3000,
            confirmButtonColor: '#16a34a',
            showConfirmButton: false
          });

          config.onSuccess?.(res);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: this.translate.instant('ALERTS.DELETE_FAILED'),
            confirmButtonText: this.translate.instant('ALERTS.CLOSE'),
            showCloseButton: true,
            confirmButtonColor: '#16a34a',
            text: err?.message || this.translate.instant('ALERTS.SOMETHING_WENT_WRONG')
          });
          config.onError?.(err);
        }
      });

    });
  }
}
