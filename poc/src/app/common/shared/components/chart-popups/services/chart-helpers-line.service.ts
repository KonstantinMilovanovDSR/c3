import { Injectable } from '@angular/core'
import { ChartHelpersService } from '@src/app/common/shared/components/chart-popups/services/chart-helpers.service'

@Injectable()
export class ChartHelpersLineService extends ChartHelpersService {
  protected readonly POPUP_OFFSET_LEFT = -3
  protected readonly POPUP_OFFSET_RIGHT = 5
  protected readonly POPUP_OFFSET_TOP = 10
  protected readonly POPUP_HIDE_GAP = -5

  xBarClass = '.c3-grid.c3-grid-lines'
  selector = '.c3-circle-'

  updatePopup = ({ popup, bbox, barsWidth, eventRectWidth, popupWidth }): void => {
    popup.x = this.calculatePopupX({ bbox, barsWidth, eventRectWidth, popupWidth })
    popup.y = bbox.y + this.POPUP_OFFSET_TOP
    popup.show = bbox.x >= this.POPUP_HIDE_GAP && bbox.x <= eventRectWidth
  }

  calculatePopupX = ({ bbox, barsWidth, eventRectWidth, popupWidth }) => {
    return bbox.x + barsWidth + popupWidth <= eventRectWidth
      ? bbox.x + barsWidth + this.POPUP_OFFSET_RIGHT
      : bbox.x + barsWidth - popupWidth - this.POPUP_OFFSET_LEFT
  }

  createPopup = ({ d, element, bbox, barsWidth, eventRectWidth, popupWidth, removeCallback }) => {
    return {
      x: this.calculatePopupX({ bbox, barsWidth, eventRectWidth, popupWidth }),
      y: bbox.y + this.POPUP_OFFSET_TOP,
      point: d,
      element,
      show: bbox.x >= this.POPUP_HIDE_GAP && bbox.x <= eventRectWidth,
      index: d.index,
      data: d.value,
      clicked: removeCallback,
    }
  }
}
