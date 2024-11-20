import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NumberInputComponent } from '@src/app/common/shared/components/number-input/number-input.component'
import { BarChartWrapperComponent } from '@src/app/common/shared/components/bar-chart-wrapper/bar-chart-wrapper.component'
import { LineChartWrapperComponent } from '@src/app/common/shared/components/line-chart-wrapper/line-chart-wrapper.component'
import { ChartPanelComponent } from '@src/app/common/shared/components/chart-panel/chart-panel.component'
import { ResizeVHandleComponent } from '@src/app/common/shared/components/resize-handle/resize-v-handle.component'
import { ScrollDirectionDirective } from '@src/app/common/shared/directives/scroll-direction.directive'
import { ResizableModule } from 'angular-resizable-element-labworks'
import { PurePipeCreator } from '@src/app/common/shared/pipes/pure-pipe-creator'
import { IntersectionObserverDirective } from '@src/app/common/shared/directives/intersection-observer/intersection-observer.directive'
import { IntersectionRootDirective } from '@src/app/common/shared/directives/intersection-observer/intersection-root.directive'
import { IntersectionObserveeDirective } from '@src/app/common/shared/directives/intersection-observer/intersection-observee.directive'
import { PopupComponent } from '@src/app/common/shared/components/popup/popup.component'
import { PopupsStoreService } from '@src/app/common/shared/services/popups-store.service'
import { ChartPopupsComponent } from '@src/app/common/shared/components/chart-popups/chart-popups.component'
import { ChartHelpersLineService } from '@src/app/common/shared/components/chart-popups/services/chart-helpers-line.service'
import { ChartHelpersBarService } from '@src/app/common/shared/components/chart-popups/services/chart-helpers-bar.service'

@NgModule({
  declarations: [
    LineChartWrapperComponent,
    BarChartWrapperComponent,
    NumberInputComponent,
    ChartPanelComponent,
    ResizeVHandleComponent,
    PopupComponent,
    ChartPopupsComponent,
    ScrollDirectionDirective,
    IntersectionObserverDirective,
    IntersectionObserveeDirective,
    IntersectionRootDirective,
    PurePipeCreator,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ResizableModule],
  exports: [
    NumberInputComponent,
    LineChartWrapperComponent,
    BarChartWrapperComponent,
    ChartPanelComponent,
    ResizeVHandleComponent,
    ScrollDirectionDirective,
    IntersectionObserverDirective,
    IntersectionObserveeDirective,
    IntersectionRootDirective,
    PurePipeCreator,
  ],
  providers: [PopupsStoreService, ChartHelpersLineService, ChartHelpersBarService],
})
export class SharedModule {}
