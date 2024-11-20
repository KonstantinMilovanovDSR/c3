import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EmbeddedViewRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import {
  ChartSize,
  CheckDomainPredicate,
  CustomPoint,
  CustomPointContext,
  CustomPointsHandler,
  GridLine,
  SelectedPoint,
} from '@src/app/common/shared/components/chart-wrapper-base/chart-wrapper.types'
import { LineChartWrapperComponent } from '@src/app/common/shared/components/line-chart-wrapper/line-chart-wrapper.component'
import {
  generateCustomPoints,
  generateDataset,
  generateSelectedPoints,
  getMaxLengthOfElementsAndGetDifferences,
} from '@src/app/common/utils/helpers'
import { DataPoint, Domain } from 'c3'
import { MIN_DOMAIN_RANGE } from '@src/app/common/shared/components/chart-wrapper-base/chart-wrapper-base.consts'
import { customPointsHandler } from '@src/app/common/utils/custom-points.helper'
import { DEBOUNCE_TIME_SMALL } from '@src/app/common/constants/constants'
import { debounceTime, fromEvent } from 'rxjs'
import * as htmlToImage from 'html-to-image'

interface ChartInfo {
  dataSet: number[]
  popups: any[]
}

@Component({
  selector: 'lw-vertical-line-sync-sandbox',
  templateUrl: './vertical-line-sync-sandbox.component.html',
  styleUrls: ['./vertical-line-sync-sandbox.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalLineSyncSandboxComponent implements OnInit {
  readonly POPUP_HEIGHT = 175
  pCount = 100

  minY: number[] = [10, 10]
  maxY: number[] = [1000, 1000]

  topLimitValue = 1000

  chartInfos: ChartInfo[] = []

  yGridLineTopLimit: GridLine = {
    value: this.topLimitValue,
    text: 'TL',
    class: 'custom-dotted-line',
    color: '#333333',
  }

  _yGridLines: GridLine[] = [
    { value: 100, text: 'LSL', class: 'custom-dotted-line', color: '#ED2024' },
    { value: 200, text: 'LWL', class: 'custom-dotted-line', color: '#FF9900' },
    { value: 300, text: 'LCL', class: 'custom-dotted-line', color: '#BA191C' },
    { value: 500, text: 'Target', class: 'custom-dotted-line', color: '#00AD1D' },
    { value: 600, text: 'CL', class: 'custom-dotted-line', color: '#007A14' },
    { value: 700, text: 'UWL', class: 'custom-dotted-line', color: '#FF9900' },
    { value: 800, text: 'UCL', class: 'custom-dotted-line', color: '#BA191C' },
  ]
  yGridLines: GridLine[] = this._yGridLines

  yGridLinesTopLimitEnabled = false

  selectedPoints: SelectedPoint[] = []

  customPoints: CustomPoint[] = []

  customPointsHandler = customPointsHandler
  currentDomain: Domain

  @ViewChild('chartWrapperTop', { read: LineChartWrapperComponent }) chartWrapperTop: LineChartWrapperComponent
  @ViewChild('chartWrapperBottom', { read: LineChartWrapperComponent }) chartWrapperBottom: LineChartWrapperComponent
  @ViewChild('chartsContainer', { read: ElementRef }) chartsContainer: ElementRef<HTMLDivElement>
  @ViewChild('dynamicChartsContainer', { read: ViewContainerRef }) dynamicChartsContainer: ViewContainerRef

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    fromEvent(window, 'resize')
      .pipe(debounceTime(DEBOUNCE_TIME_SMALL))
      .subscribe(() => {
        this.windowResize()
      })
  }

  ngOnInit(): void {
    for (let i = 0; i < 2; i++) {
      this.chartInfos.push({
        dataSet: this.dataSetUpdate(this.minY[i], this.maxY[i]),
        popups: [],
      })
    }
    this.maxDataSetValueLengths = getMaxLengthOfElementsAndGetDifferences(this.dataSets[0], this.dataSets[1])
  }

  updateY1Range(): void {
    this.chartInfos[0].dataSet = this.dataSetUpdate(this.minY[0], this.maxY[0])

    this.maxDataSetValueLengths = getMaxLengthOfElementsAndGetDifferences(
      ...(this.yGridLinesTopLimitEnabled ? this.dataSetsWithTopLimit : this.dataSets)
    )
  }

  updateY2Range(): void {
    this.dataSets[1] = this.dataSetUpdate(this.minY[1], this.maxY[1])

    this.maxDataSetValueLengths = getMaxLengthOfElementsAndGetDifferences(
      ...(this.yGridLinesTopLimitEnabled ? this.dataSetsWithTopLimit : this.dataSets)
    )
  }
  toggleTopLimit(): void {
    this.setYGridLines()
    this.maxDataSetValueLengths = getMaxLengthOfElementsAndGetDifferences(
      ...(this.yGridLinesTopLimitEnabled ? this.dataSetsWithTopLimit : this.dataSets)
    )
  }
  topLimitValueChange(): void {
    this.yGridLineTopLimit.value = this.topLimitValue
    this.setYGridLines()
    this.maxDataSetValueLengths = getMaxLengthOfElementsAndGetDifferences(
      ...(this.yGridLinesTopLimitEnabled ? this.dataSetsWithTopLimit : this.dataSets)
    )
  }

  updatePopups(index: number, popups: any) {
    const popupsArr = Object.values<any>(popups)
    this.chartInfos[index].popups = popupsArr[index]
  }

  calcImageSize(index: number, chartRect: DOMRect) {
    let maxY = 0
    this.chartInfos[index].popups.forEach((item) => {
      if (item.y > maxY) {
        maxY = item.y
      }
    })
    return { width: chartRect.width, height: Math.max(chartRect.height, maxY + this.POPUP_HEIGHT) }
  }

  async createHTML() {
    for (let i = 0; i < this.chartInfos.length; i++) {
      const component = this.dynamicChartsContainer.createComponent(LineChartWrapperComponent)

      component.instance.dataSet = this.chartInfos[i].dataSet
      component.instance.size = this.chartSize
      component.instance.hideXTicks = true
      component.instance.yGridLines = this.yGridLines
      component.instance.yGridLinesTopLimitEnabled = this.yGridLinesTopLimitEnabled
      component.instance.customPoints = this.customPoints
      component.instance.initialDomain = this.currentDomain
      component.instance.relativeClipPath = true
      component.instance.popups = this.chartInfos[i].popups
      component.instance.customViewContainerRef = this.dynamicChartsContainer

      const element: HTMLElement = component.location.nativeElement
      element.style.setProperty('width', `${this.chartSize.width}px`)
      element.style.setProperty('height', `${this.chartSize.height}px`)
      await this.exportToSvg(i, element)
      component.destroy()
    }
  }

  async exportToSvg(index: number, el: HTMLElement) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const fontEmbedCSS = await htmlToImage.getFontEmbedCSS(el)
    const { width, height } = this.calcImageSize(index, el.getBoundingClientRect())
    canvas.width = width
    canvas.height = height

    return htmlToImage
      .toSvg(el, { fontEmbedCSS, width, height })
      .then(function (dataUrl) {
        const img = new Image()
        img.addEventListener('load', (e: any) => {
          ctx.drawImage(e.target, 0, 0)
        })
        img.src = dataUrl
        document.body.appendChild(canvas)
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
      })
  }

  chartSize: ChartSize = { height: 420 }
  maxDataSetValueLengths: number[]

  rotated = true

  formatX(x: string): string {
    return `Sample ${x} long label`
  }
  formatY(y: string): string {
    return y
  }

  private masterChart: LineChartWrapperComponent = null

  get dataSets(): number[][] {
    return [this.chartInfos[0].dataSet, this.chartInfos[1].dataSet]
  }

  get dataSetsWithTopLimit(): number[][] {
    return [
      [...this.chartInfos[0].dataSet, this.yGridLineTopLimit.value],
      [...this.chartInfos[1].dataSet, this.yGridLineTopLimit.value],
    ]
  }

  setYGridLines(): void {
    const yLines = [...this._yGridLines]
    if (this.yGridLinesTopLimitEnabled) yLines.push(this.yGridLineTopLimit)
    this.yGridLines = yLines
  }

  isDomainCorrect: CheckDomainPredicate = (domain: Domain) => {
    return !(Math.abs(domain[0] - domain[1]) <= MIN_DOMAIN_RANGE)
  }

  onShowXGridFocusTop(d: DataPoint): void {
    this.xFocusShow(this.chartWrapperBottom, d)
  }

  onHideXGridFocusTop(): void {
    this.xFocusHide(this.chartWrapperBottom)
  }

  onShowXGridFocusBottom(d: DataPoint): void {
    this.xFocusShow(this.chartWrapperTop, d)
  }

  onHideXGridFocusBottom(): void {
    this.xFocusHide(this.chartWrapperTop)
  }

  onZoomStartTop(): void {
    this.masterChart = this.chartWrapperTop
  }

  onZoomEndTop(domain: Domain): void {
    if (this.masterChart === this.chartWrapperTop) {
      this.zoomChart(this.chartWrapperBottom, domain)
    }
  }

  onZoomTop(domain: Domain): void {
    this.currentDomain = domain
    if (this.masterChart === this.chartWrapperTop) {
      this.zoomChart(this.chartWrapperBottom, domain)
    }
  }

  onZoomStartBottom(): void {
    this.masterChart = this.chartWrapperBottom
  }

  onZoomEndBottom(domain: Domain): void {
    if (this.masterChart === this.chartWrapperBottom) {
      this.zoomChart(this.chartWrapperTop, domain)
    }
  }

  onZoomBottom(domain: Domain): void {
    if (this.masterChart === this.chartWrapperBottom) {
      this.zoomChart(this.chartWrapperTop, domain)
    }
  }

  zoomIn(): void {
    this.masterChart = this.chartWrapperTop
    this.chartWrapperTop.zoomStep('in')
  }

  zoomOut(): void {
    this.masterChart = this.chartWrapperTop
    this.chartWrapperTop.zoomStep('out')
  }

  zoomReset(): void {
    this.masterChart = this.chartWrapperTop
    this.chartWrapperTop.resetZoom()
  }

  addCustomPoints(): void {
    this.customPoints = generateCustomPoints(this.pCount)
  }

  clearCustomPoints(): void {
    this.customPoints = []
  }

  addSelectedPoints(): void {
    this.selectedPoints = generateSelectedPoints(this.pCount)
  }

  clearSelectedPoints(): void {
    this.selectedPoints = []
  }

  protected zoomChart = (chartWrapper: LineChartWrapperComponent, domain: number[]) => {
    chartWrapper.getInstance().zoom(domain)
  }

  protected xFocusShow(chartWrapper: LineChartWrapperComponent, d: DataPoint): void {
    chartWrapper?.getInstance().xgrids([{ value: d.x }])
  }

  protected xFocusHide(chartWrapper: LineChartWrapperComponent): void {
    chartWrapper?.getInstance().xgrids.remove()
  }

  protected windowResize(): void {
    this.adjustChartWidth()
    this.changeDetectorRef.markForCheck()
  }

  protected adjustChartWidth(): void {
    const width = this.chartsContainer.nativeElement.offsetWidth
    this.chartSize = { ...this.chartSize, width }
  }

  private dataSetUpdate(min: number, max: number): number[] {
    return generateDataset(min, max, this.pCount)
  }
}
