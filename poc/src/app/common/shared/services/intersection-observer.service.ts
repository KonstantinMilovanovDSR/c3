import { IntersectionObserverOptions } from '@src/app/common/shared/directives/intersection-observer/intersection-observer.types'
import { Injectable, OnDestroy } from '@angular/core'
import { distinctUntilChanged, fromEvent, map, Subject, Subscription } from 'rxjs'
import { DEBOUNCE_TIME_SMALL } from '@src/app/common/constants/constants'
import { ScrollDirection } from '@src/app/common/shared/directives/scroll-direction.directive'

@Injectable()
export class IntersectionObserverService implements OnDestroy {
  private options: IntersectionObserverOptions
  private rootElement: HTMLElement
  private readonly callbacks = new Map<Element, IntersectionObserverCallback>()
  private intersectionObserver: IntersectionObserver

  private subscription = new Subscription()
  private direction: ScrollDirection = 'down'
  private currentScroll = 0
  private timeThreshold = DEBOUNCE_TIME_SMALL / 2
  private lastTimestamp = 0

  private directionChange = new Subject<ScrollDirection>()

  directionChange$ = this.directionChange.asObservable()

  init(rootElement: HTMLElement, options: IntersectionObserverOptions): void {
    this.options = options
    this.rootElement = rootElement
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = this.callbacks.get(entry.target)
          return callback && callback([entry], this.intersectionObserver)
        })
      },
      {
        root: this.rootElement,
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold,
      }
    )

    this.subscription.add(
      fromEvent(this.rootElement, 'scroll')
        .pipe(
          map((event) => {
            const scrollTop = (event.target as Element).scrollTop
            const time = new Date().getTime()
            const timeOffset = time - this.lastTimestamp
            const scrollOffset = scrollTop - this.currentScroll
            if (timeOffset > this.timeThreshold) {
              this.direction = scrollOffset < 0 ? 'up' : 'down'
            }
            this.currentScroll = scrollTop
            this.lastTimestamp = time
            return this.direction
          }),

          distinctUntilChanged()
        )
        .subscribe((direction) => {
          this.directionChange.next(direction)
        })
    )
  }

  ngOnDestroy(): void {
    this.intersectionObserver.disconnect()
    this.subscription.unsubscribe()
  }

  observe(target: Element, callback: IntersectionObserverCallback = () => {}) {
    this.intersectionObserver.observe(target)
    this.callbacks.set(target, callback)
  }

  unobserve(target: Element) {
    this.intersectionObserver.unobserve(target)
    this.callbacks.delete(target)
  }
}
