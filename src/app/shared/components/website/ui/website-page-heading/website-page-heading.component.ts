import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-website-page-heading',
  imports: [BreadcrumbModule],
  templateUrl: './website-page-heading.component.html',
  styleUrl: './website-page-heading.component.scss',
})
export class WebsitePageHeadingComponent {
    @Input({ required: true }) title!: string;
  @Input() description = '';
  @Input() breadcrumbs: MenuItem[] = [];
  @Input() home: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/',
  };

}

