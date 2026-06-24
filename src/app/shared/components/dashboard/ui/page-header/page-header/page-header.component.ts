import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() description: string = 'You can check all details';
  @Input() buttonLabel: string = 'Add New';
  @Input() linkUrl: string = '/'

}
