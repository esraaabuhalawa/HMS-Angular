import { Component } from '@angular/core';

import { NavbarComponent } from "../../../shared/components/website/ui/navbar/navbar.component";
import { FooterComponent } from "../../../shared/components/website/ui/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-website-layout',
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
  templateUrl: './website-layout.component.html',
  styleUrl: './website-layout.component.scss',
})
export class WebsiteLayoutComponent {}
