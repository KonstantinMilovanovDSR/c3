import { Component, Input } from '@angular/core'

@Component({ selector: 'lw-popup', templateUrl: './popup.component.html', styleUrls: ['./popup.component.less'] })
export class PopupComponent {
  @Input() data: number
}
