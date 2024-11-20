import { Injectable } from '@angular/core'

@Injectable()
export abstract class ChartHelpersService {
  protected abstract readonly POPUP_OFFSET_LEFT: number
  protected abstract readonly POPUP_OFFSET_RIGHT: number
  protected abstract readonly POPUP_OFFSET_TOP: number
  protected abstract readonly POPUP_HIDE_GAP: number
  abstract xBarClass: string
  abstract selector: string
  abstract updatePopup: (popup, b, w: number, e: number, p: number) => void
  abstract calculatePopupX: ({ bbox, barsWidth, eventRectWidth, popupWidth }) => number
  abstract createPopup: ({ d, element, bbox, barsWidth, eventRectWidth, popupWidth, removeCallback }) => unknown
}
