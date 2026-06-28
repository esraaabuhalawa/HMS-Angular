import { Component, EventEmitter, Input, Output} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IAd } from '../../interfaces/ads.interface';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-view-ad',
  imports: [DialogModule, InputTextModule, ButtonModule, TranslatePipe,
    Divider,Tag,Skeleton, CurrencyPipe, DatePipe
  ],
  templateUrl: './view-ad.component.html',
  styleUrl: './view-ad.component.scss',
})
export class ViewAdComponent {
 @Input() selectedAd: IAd | null = null;
  @Input() visible = false;
  @Input() loading = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visibleChange.emit(false);
  }
}
