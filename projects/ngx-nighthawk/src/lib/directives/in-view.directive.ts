import { Directive, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID, output, OutputEmitterRef, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Directive({
  selector: "[nighthawkInView]",
  standalone: true,
})
export class NighthawkInViewDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  readonly inView: OutputEmitterRef<boolean> = output();
  private observer: IntersectionObserver | null = null;

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && "IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.inView.emit(entry.isIntersecting);
          });
        },
        {
          threshold: [0, 0.5, 1],
        },
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
