import { ComponentRef, ElementRef, EmbeddedViewRef, Injectable } from '@angular/core'
import { PopupComponent } from '@src/app/common/shared/components/popup/popup.component'
import { PopupsStoreService } from '@src/app/common/shared/services/popups-store.service'
import { throttleTime } from '@src/app/common/utils/helpers'

@Injectable()
export class ChartWrapperPopupsService {
  chartId: string | number
  chart: ElementRef
  popupShadow: ComponentRef<PopupComponent>
  showPopups = true

  popupWidth = 0
  xBarWidth = 0
  chartWidth = 0

  xBarClass: string

  popupsStoreService: PopupsStoreService
  updatePopupsThrottle = throttleTime(() => this.updatePopupsProps(), 5)
  updatePopup: ({ popup, bbox, barsWidth, eventRectWidth, popupWidth }) => void

  updateWidths(): void {
    this.popupWidth = (this.popupShadow.hostView as EmbeddedViewRef<any>).rootNodes[0].getBoundingClientRect().width
    this.xBarWidth = this.chart.nativeElement.querySelector(this.xBarClass).getBoundingClientRect().width
    this.chartWidth = this.chart.nativeElement.getBoundingClientRect().width
  }

  init({ viewContainerRef, chart, updatePopup, popupsStoreService, chartId, xBarClass }): void {
    this.popupShadow = viewContainerRef.createComponent(PopupComponent)
    this.chart = chart
    this.chartId = chartId
    this.updatePopup = updatePopup
    this.popupsStoreService = popupsStoreService
    this.xBarClass = xBarClass
    if (!this.popupsStoreService.popups[this.chartId]) {
      this.popupsStoreService.popups[this.chartId] = []
    }
    const popupShadowEl = (this.popupShadow.hostView as EmbeddedViewRef<any>).rootNodes[0]
    popupShadowEl.style.zIndex = -1
  }

  afterViewInit(selector: string): void {
    this.popupsStoreService.popups[this.chartId].forEach((popup) => {
      popup.element = this.chart.nativeElement.querySelector(selector + popup.index)
    })
    this.updateWidths()
  }

  updatePopupsProps(): void {
    const eventRectWidth = this.chart.nativeElement.querySelector('.c3-event-rect').getBoundingClientRect().width
    const barsWidth = this.chartWidth - this.xBarWidth
    this.popupsStoreService.popups[this.chartId].forEach((popup) => {
      const bbox = popup.element.getBBox()
      this.updatePopup({ popup, bbox, barsWidth, eventRectWidth, popupWidth: this.popupWidth })
    })
  }

  onPointClick(d, element, createPopup: ({ bbox, barsWidth, eventRectWidth, popupWidth, removeCallback }) => any): void {
    if (this.popupsStoreService.popups[this.chartId].find((popup) => popup.index === d.index)) {
      return
    }
    this.updateWidths()
    const eventRectWidth = this.chart.nativeElement.querySelector('.c3-event-rect').getBoundingClientRect().width
    const bbox = element.getBBox()
    const barsWidth = this.chartWidth - this.xBarWidth
    const removeCallback = (): void => {
      this.popupsStoreService.popups[this.chartId] = this.popupsStoreService.popups[this.chartId].filter(({ point }) => {
        return d.x !== point.x
      })
    }
    this.popupsStoreService.popups[this.chartId].push(
      createPopup({
        bbox,
        barsWidth,
        eventRectWidth,
        popupWidth: this.popupWidth,
        removeCallback,
      })
    )
    this.showPopups = true
  }
}
