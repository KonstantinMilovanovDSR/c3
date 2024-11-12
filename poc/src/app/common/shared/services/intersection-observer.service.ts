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
