/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  ViewContainerRef,
  OnDestroy,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DropdownPanel } from '../interfaces/dropdown-panel.interface';
import { fromEvent } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';

@Directive({
  standalone: true,
  selector: '[nighthawk-dropdown-trigger]',
})
export class NighthawkDropdownTriggerForDirective implements OnInit, OnDestroy {
  private overlayRef!: any;
  private leaveTimeout!: any;
  private isBrowser: boolean = false;

  @Input() public dropdownTrigger!: DropdownPanel;
  @Input() public direction: 'start' | 'center' | 'end' = 'end';
  @Input() public dropdownOffset: number = 8;
  @Input() public dropdownHideDelay: number = 500;
  @Input() public dropdownOnHover: boolean = false;
  @Input() public dropdownCloseOnClickInside: boolean = true;
  @Input() public dropdownCloseOnRouteChange: boolean = true;
  @Input() public dropdownPanelClass: string = '';
  @Input() public disabled: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private readonly router: Router,
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @HostListener('click', ['$event']) onClick() {
    if (!this.isBrowser || this.disabled) {
      return;
    }

    if (!this.overlayRef) {
      const overlayConfig = this.getOverlayConfig();
      this.overlayRef = this.overlay.create(overlayConfig);
      const templatePortal = new TemplatePortal(
        this.dropdownTrigger.templateRef,
        this.viewContainerRef
      );
      this.overlayRef.attach(templatePortal);

      setTimeout(() => {
        this.overlayRef.overlayElement.classList.add('visible');
      });
    } else {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.isBrowser || this.disabled) {
      return;
    }

    if (this.dropdownOnHover && !this.overlayRef) {
      const overlayConfig = this.getOverlayConfig();
      this.overlayRef = this.overlay.create(overlayConfig);
      const templatePortal = new TemplatePortal(
        this.dropdownTrigger.templateRef,
        this.viewContainerRef
      );

      this.overlayRef.attach(templatePortal);

      setTimeout(() => {
        this.overlayRef.overlayElement.classList.add('visible');
      });

      fromEvent<MouseEvent>(
        this.overlayRef.overlayElement,
        'mouseleave'
      ).subscribe(() => {
        this.leaveTimeout = setTimeout(() => {
          this.overlayRef.detach();
          this.overlayRef = null;
        }, this.dropdownHideDelay);
      });
    } else {
      clearTimeout(this.leaveTimeout);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.isBrowser && this.dropdownOnHover && this.overlayRef) {
      this.leaveTimeout = setTimeout(() => {
        this.overlayRef.detach();
        this.overlayRef = null;
      }, this.dropdownHideDelay);
    }
  }

  @HostListener('document:mousemove', ['$event']) onMouseMove(
    event: MouseEvent
  ) {
    if (
      this.dropdownOnHover &&
      this.overlayRef &&
      this.isCursorInsideDropdown(event)
    ) {
      clearTimeout(this.leaveTimeout);
    }
  }

  public ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (
        this.isBrowser &&
        this.overlayRef &&
        this.dropdownCloseOnRouteChange &&
        event instanceof NavigationStart
      ) {
        this.overlayRef.detach();
        this.overlayRef = null;
      }
    });

    if (this.isBrowser) {
      fromEvent<MouseEvent>(document, 'click').subscribe(
        (event: MouseEvent) => {
          if (
            this.overlayRef &&
            !this.elementRef.nativeElement.contains(event.target)
          ) {
            if (!this.overlayRef.overlayElement.contains(event.target)) {
              setTimeout(() => {
                this.overlayRef.detach();
                this.overlayRef = null;
              }, this.dropdownHideDelay);
            }
          }
        }
      );

      fromEvent<MouseEvent>(document, 'click').subscribe(
        (event: MouseEvent) => {
          if (
            this.overlayRef &&
            this.dropdownCloseOnClickInside &&
            this.isCursorInsideDropdown(event)
          ) {
            setTimeout(() => {
              this.overlayRef.detach();
              this.overlayRef = null;
            }, this.dropdownHideDelay);
          }
        }
      );
    }
  }

  private isCursorInsideDropdown(event: MouseEvent): boolean {
    const dropdownElement = this.overlayRef
      ? this.overlayRef.overlayElement
      : null;
    const dropdownElementRect = dropdownElement
      ? dropdownElement.getBoundingClientRect()
      : null;

    return !!(
      dropdownElementRect &&
      event.clientX >= dropdownElementRect.left &&
      event.clientX <= dropdownElementRect.right &&
      event.clientY >= dropdownElementRect.top &&
      event.clientY <= dropdownElementRect.bottom
    );
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: this.direction,
          originY: 'bottom',
          overlayX: this.direction,
          overlayY: 'top',
          offsetY: this.dropdownOffset,
        },
      ]);

    const overlayConfig = new OverlayConfig({
      panelClass: this.dropdownPanelClass,
      hasBackdrop: false,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    return overlayConfig;
  }

  ngOnDestroy() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
