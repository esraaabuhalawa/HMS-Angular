import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() description: string = 'You can check all details';
  @Input() buttonLabel: string = 'Add New';

  @Output() onButtonClick = new EventEmitter<void>();

  btnClick() {
    this.onButtonClick.emit();
  }
}
