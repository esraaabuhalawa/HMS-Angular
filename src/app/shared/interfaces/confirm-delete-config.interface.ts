import { Observable } from 'rxjs';

export interface ConfirmDeleteConfig<T = any> {
  entity: string;
  label?: string;

  request: () => Observable<T>;

  onSuccess?: (res: T) => void;
  onError?: (err: any) => void;

  confirmButtonText?: string;

  html?: string;
  text?: string;
}
