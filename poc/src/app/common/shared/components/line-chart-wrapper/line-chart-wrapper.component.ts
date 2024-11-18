import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core'
import { DataPoint, Domain, PrimitiveArray } from 'c3'
import { arrayToObject, getNeededSpaces } from '@src/app/common/utils/helpers'
import { ChartWrapperBaseComponent } from '@src/app/common/shared/components/chart-wrapper-base/chart-wrapper-base.component'
import {
  CustomPoint,
  CustomPointContext,
  CustomPointsHandler,
  SelectedPoint,
} from '@src/app/common/shared/components/chart-wrapper-base/chart-wrapper.types'
import {
  MAIN_DATA_SET,
  POINT_R,
  SELECTED_POINT_R,
  TOP_LIMIT_DATA_SET,
} from '@src/app/common/shared/components/chart-wrapper-base/chart-wrapper-base.consts'
import { PopupComponent } from '@src/app/common/shared/components/popup/popup.component'

@Component({
  selector: 'lw-line-chart-wrapper',
  templateUrl: '../chart-wrapper-base/chart-wrapper-base.component.html',
  styleUrls: ['../chart-wrapper-base/chart-wrapper-base.component.less', './line-chart-wrapper.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartWrapperComponent extends ChartWrapperBaseComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() dataSet: PrimitiveArray
  @Input() useSelection = false
  @Input() selectedPoints: SelectedPoint[] = []
  @Input() customPoints: CustomPoint[] = []
  @Input() customPointsHandler: CustomPointsHandler
  @Input() maxDataSetValueLength: number

  popupShadow: ComponentRef<PopupComponent>

  customPointsMap: Record<number, CustomPoint> = {}

  constructor(private viewContainerRef: ViewContainerRef) {
    super()
    console.time('chart')
  }

  override ngOnInit(): void {
    super.ngOnInit()
    this.popupShadow = this.viewContainerRef.createComponent(PopupComponent)
    const popupShadowEl = (this.popupShadow.hostView as EmbeddedViewRef<any>).rootNodes[0]
    popupShadowEl.style.zIndex = -1
    console.log(popupShadowEl.getBoundingClientRect().height)
  }

  private updatePopupsProps(): void {
    console.log(this.popups.map((pp) => pp.element.getBBox()))
    const barsWidth = this.chart.nativeElement.querySelector('.c3-axis.c3-axis-y')?.getBoundingClientRect().width
    this.popups.forEach((popup) => {
      const bbox = popup.element.getBBox()
      popup.x = bbox.x + barsWidth
      popup.y = bbox.y
    })
  }

  protected override getParams(): any {
    return {
      bindto: `#${this.chartId}`,
      size: this.size,
      data: {
        columns: [[MAIN_DATA_SET, ...this.dataSet]],
        types: {
          data: 'area',
        },
        selection: {
          enabled: this.useSelection,
        },
        onclick: (d, element) => {
          const barsWidth = this.chart.nativeElement.querySelector('.c3-axis.c3-axis-y')?.getBoundingClientRect().width
          const bbox = element.getBBox()
          // console.log(d, element, barsWidth, bbox, this.chart.nativeElement, this.chart.nativeElement.querySelector('.chart.c3'))
          // console.log(`translate(${bbox.x + barsWidth}px, ${bbox.y - this.height}px)`)
          this.popups.push({ x: bbox.x + barsWidth, y: bbox.y, point: d, element })
          // console.log(this.instance.data())
          this.showPopups = true
        },
        ondragstart: () => {
          this.showPopups = false
        },
        ondragend: () => {
          this.showPopups = true
          this.updatePopupsProps()
        },
      },
      zoom: {
        enabled: true,
        rescale: true,
        onzoom: (domain: Domain) => {
          this.onZoom(domain)
        },
        onzoomstart: () => {
          this.onZoomStart()
          this.showPopups = false
        },
        onzoomend: (domain: Domain) => {
          console.log(domain)
          this.onZoomEnd(domain)
          this.showPopups = true
          this.updatePopupsProps()
        },
      },
      legend: {
        show: false,
      },
      point: {
        r: POINT_R,
        select: {
          r: SELECTED_POINT_R,
        },
        focus: {
          expand: {
            enabled: false,
          },
        },
      },
      transition: {
        duration: 0, // Disable animation
      },
      axis: {
        x: {
          tick: {
            format: (x: number) => {
              if (this.hideXTicks) return ''
              if (this.formatX) return this.formatX(String(x))
              return x
            },
            values: Array(this.dataSet.length)
              .fill(0)
              .map((v, i) => i),
            rotate: this.xAxisRotated ? -90 : 0,
          },
        },
        y: {
          tick: {
            format: (y: number) => {
              const spaces = this.maxDataSetValueLength ? getNeededSpaces(this.maxDataSetValueLength + 1) : ''
              const yString = spaces + y
              if (this.formatY) return this.formatY(String(yString))
              return yString
            },
          },
        },
      },
      grid: {
        lines: {
          front: false,
        },
      },
      context: {
        isSelectByClickDisabled: (d: DataPoint) => {
          return d?.id === MAIN_DATA_SET
        },
        isHideXLabelIfNotVisibleDisabled: (id: string) => {
          // TODO: add chart types in which we could disable this functionality
          return false
        },
        isMouseOverDisabled: (d: DataPoint) => {
          return d?.value === null || d?.id === TOP_LIMIT_DATA_SET
        },
        isDataDisabled: (id: string) => {
          return id === TOP_LIMIT_DATA_SET
        },
        isShowXGridFocusDisabled: (d: DataPoint) => {
          return d?.id === TOP_LIMIT_DATA_SET
        },
        onShowXGridFocus: (d: DataPoint) => {
          this.showXGridFocus.emit(d)
        },
        onHideXGridFocus: () => {
          this.hideXGridFocus.emit()
        },
        limitAxisMaxLength: (x: string) => {
          x = String(x)
          return x.length < this.xAxisMaxLength ? x : `${x.substring(0, this.xAxisMaxLength)}\u2026`
        },
        customPointsHandler: {
          append: (context: CustomPointContext) => {
            const { d } = context
            this.customPointsHandler?.append({ ...context, getTag: () => this.customPointsMap[d.index]?.tag })
          },
          redraw: (context: CustomPointContext) => {
            this.customPointsHandler?.redraw({
              ...context,
              getTag: (d: DataPoint) => {
                return this.customPointsMap[d.index]?.tag
              },
            })
          },
          remove: (context: CustomPointContext) => {
            this.customPointsHandler?.remove(context)
          },
        },
      },
    }
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
    this.selectPoints(this.selectedPoints)
    this.customizePoints(this.customPoints)
    console.timeEnd('chart')
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes)
    if (changes.selectedPoints && !changes.selectedPoints.firstChange) {
      this.selectPoints(this.selectedPoints)
    }
    if (changes.customPoints && !changes.customPoints.firstChange) {
      this.customizePoints(this.customPoints)
    }
    // TODO: temporary dataset updates
    if (changes.dataSet && !changes.dataSet.firstChange) {
      this.updateParams()
    }
    if (changes.maxDataSetValueLength && !changes.maxDataSetValueLength.firstChange) {
      this.updateParams()
    }
    if (changes.xAxisRotated && !changes.xAxisRotated.firstChange) {
      this.updateParams()
    }
  }

  protected override patchParams(params: any): any {
    super.patchParams(params)
    if (this.yGridLines && this.yGridLinesTopLimitEnabled) {
      const maxYLine = this.getMaxYLine()
      this.params.data.columns.push([TOP_LIMIT_DATA_SET, ...this.dataSet.map(() => maxYLine)])
    }
  }

  protected override refreshYGrids(): void {
    this.instance?.ygrids(this.yGridLines)
    const maxYLine = this.getMaxYLine()
    if (this.yGridLinesTopLimitEnabled && maxYLine) {
      this.topLimitEnable(maxYLine)
    } else {
      this.topLimitDisable()
    }
  }

  protected selectPoints(points: SelectedPoint[]): void {
    const indices = points.map((p) => p.index)
    this.instance?.select(MAIN_DATA_SET, indices, true, 0)
    this.brushSelectedPoints()
  }

  protected customizePoints(points: CustomPoint[]): void {
    this.customPointsMap = arrayToObject(this.customPoints, 'index')
    this.instance?.setCustomPoint(
      MAIN_DATA_SET,
      this.customPoints.map((p) => p.index)
    )
  }

  protected topLimitEnable(limit: number) {
    const domain = this.getCurrentXDomain()
    // TODO: support bottom limit
    this.instance?.load({ columns: [[TOP_LIMIT_DATA_SET, ...this.dataSet.map(() => limit)]] })
    this.instance?.zoom(domain)
  }

  protected topLimitDisable() {
    const domain = this.getCurrentXDomain()
    this.instance?.unload([TOP_LIMIT_DATA_SET])
    this.instance?.zoom(domain)
  }

  protected brushSelectedPoints() {
    const selectedPoints = arrayToObject(this.selectedPoints, 'index')
    const selection = this.instance?.internal.main.selectAll('.c3-selected-circles').selectAll('.c3-selected-circle')
    selection.attr('stroke', ({ index }) => {
      return selectedPoints[index]?.color
    })
  }
}
