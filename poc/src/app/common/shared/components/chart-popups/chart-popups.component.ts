import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core'
import { PopupsStoreService } from '@src/app/common/shared/services/popups-store.service'
import { ChartPopupsService } from '@src/app/common/shared/components/chart-popups/chart-popups.service'
import { ChartWrapperBaseComponent } from '@src/app/common/shared/components/chart-wrapper-base/chart-wrapper-base.component'
import { CHART_EVENT_TYPE, CHART_TYPE, ChartEvent } from '@src/app/common/shared/components/chart-wrapper-base/chart-wrapper-base.types'
import { SubscriptionHandler } from '@src/app/common/utils/subscription-handler'
import { ChartHelpersService } from '@src/app/common/shared/components/chart-popups/services/chart-helpers.service'
import { ChartHelpersBarService } from '@src/app/common/shared/components/chart-popups/services/chart-helpers-bar.service'
import { ChartHelpersLineService } from '@src/app/common/shared/components/chart-popups/services/chart-helpers-line.service'

@Component({
  selector: 'lw-chart-popups',
  templateUrl: './chart-popups.component.html',
  styleUrls: ['./chart-popups.component.less'],
  providers: [ChartPopupsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPopupsComponent extends SubscriptionHandler implements OnInit {
  @Input() chart: ChartWrapperBaseComponent
  @Input() eventBus = new EventEmitter<ChartEvent>()

  private helperService: ChartHelpersService

  constructor(
    public chartPopupsService: ChartPopupsService,
    public popupsStoreService: PopupsStoreService,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super()
  }

  ngOnInit(): void {
    this.initHelperService()
    this.initWrapperPopup()
    this.initSubscriptions()
  }

  private initHelperService(): void {
    switch (this.chart.type) {
      case CHART_TYPE.BAR:
        this.helperService = this.injector.get<ChartHelpersBarService>(ChartHelpersBarService)
        break
      case CHART_TYPE.LINE:
        this.helperService = this.injector.get<ChartHelpersLineService>(ChartHelpersLineService)
        break
    }
  }

  private initWrapperPopup(): void {
    this.chartPopupsService.init({
      viewContainerRef: this.viewContainerRef,
      chart: this.chart.chart,
      popupsStoreService: this.popupsStoreService,
      chartId: this.chart.chartId,
      updatePopup: this.helperService.updatePopup,
      xBarClass: this.helperService.xBarClass,
    })
  }

  private initSubscriptions(): void {
    this.subscriptions.push(
      this.eventBus.subscribe((e) => {
        switch (e.type) {
          case CHART_EVENT_TYPE.CLICK:
            this.chartPopupsService.onPointClick(e.data.d, e.data.element, this.helperService.createPopup)
            break
          case CHART_EVENT_TYPE.ZOOM:
            this.chartPopupsService.updatePopupsThrottle()
            break
          case CHART_EVENT_TYPE.AFTER_INIT: {
            this.chartPopupsService.afterViewInit(this.helperService.selector)
          }
        }
        this.changeDetectorRef.markForCheck()
      })
    )
  }
}
