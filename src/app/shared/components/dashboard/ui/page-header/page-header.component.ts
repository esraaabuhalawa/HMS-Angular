import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-header',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() description: string = 'COMMON.CHECK_ALL_DETAILS';
  @Input() buttonLabel: string = 'COMMON.ADD_NEW';
  @Input() linkUrl: string = ''
  @Input() linkLabel:string = '';
  @Input() showButton: boolean = true;
  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick() {
    this.buttonClick.emit();
  }
}
