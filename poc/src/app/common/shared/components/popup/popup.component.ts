import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'lw-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent {
  @Input() data: number
  @Output() clicked = new EventEmitter()

  onClickEmit(): void {
    this.clicked.emit()
  }
}
