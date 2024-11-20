import { Component, Input } from '@angular/core'
import { PopupsStoreService } from '@src/app/common/shared/services/popups-store.service'
import { ChartWrapperPopupsService } from '@src/app/common/shared/components/chart-wrapper-base/chart-wrapper-popups.service'

@Component({ selector: 'lw-chart-popups', templateUrl: './chart-popups.component.html', styleUrls: ['./chart-popups.component.less'] })
export class ChartPopupsComponent {
  @Input() chartWrapperPopupsService: ChartWrapperPopupsService
  constructor(public popupsStoreService: PopupsStoreService) {}
}
