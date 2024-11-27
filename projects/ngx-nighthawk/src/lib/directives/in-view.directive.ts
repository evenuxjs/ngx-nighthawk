import {
  Directive,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[nighthawk-in-view]',
  standalone: true,
})
export class NighthawkInViewDirective implements AfterViewInit, OnDestroy {
  readonly inView: OutputEmitterRef<boolean> = output();
  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public ngAfterViewInit(): void {
    if (
      isPlatformBrowser(this.platformId) &&
      'IntersectionObserver' in window
    ) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.inView.emit(entry.isIntersecting);
          });
        },
        {
          threshold: [0, 0.5, 1],
        }
      );

      this.observer.observe(this.el.nativeElement);
    }
  }

  public ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
