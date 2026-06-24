import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-statics-card',
  imports: [],
  templateUrl: './statics-card.component.html',
  styleUrl: './statics-card.component.scss',
})
export class StaticsCardComponent {
  @Input({ required: true }) entityValue: number = 0;
  @Input({ required: true }) entityName: string = '';
}
