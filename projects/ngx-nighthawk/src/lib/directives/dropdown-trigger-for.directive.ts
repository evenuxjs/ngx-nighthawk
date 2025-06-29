import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  ViewContainerRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Output,
  EventEmitter,
  inject,
} from "@angular/core";
import { Overlay, OverlayConfig } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { DropdownPanel } from "../interfaces/dropdown-panel.interface";
import { fromEvent } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { NavigationStart, Router } from "@angular/router";

@Directive({
  standalone: true,
  selector: "[nighthawkDropdownTrigger]",
})
export class NighthawkDropdownTriggerForDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private overlayRef!: any;
  private leaveTimeout!: any;
  private isBrowser = false;
  private _isOpen = false;

  @Input() public dropdownTrigger!: DropdownPanel;
  @Input() public direction: "start" | "center" | "end" = "end";
  @Input() public dropdownOffset = 8;
  @Input() public dropdownHideDelay = 500;
  @Input() public dropdownOnHover = false;
  @Input() public dropdownCloseOnClickInside = true;
  @Input() public dropdownCloseOnRouteChange = true;
  @Input() public dropdownPanelClass = "";
  @Input() public disabled = false;

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() public dropdownClosed: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @HostListener("click", ["$event"]) onClick() {
    if (!this.isBrowser || this.disabled) {
      return;
    }

    if (!this.overlayRef) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }

  @HostListener("mouseenter") onMouseEnter() {
    if (!this.isBrowser || this.disabled) {
      return;
    }

    if (this.dropdownOnHover && !this.overlayRef) {
      this.openDropdown();
    } else {
      clearTimeout(this.leaveTimeout);
    }
  }

  @HostListener("mouseleave") onMouseLeave() {
    if (this.isBrowser && this.dropdownOnHover && this.overlayRef) {
      this.leaveTimeout = setTimeout(() => {
        this.closeDropdown();
      }, this.dropdownHideDelay);
    }
  }

  @HostListener("document:mousemove", ["$event"]) onMouseMove(event: MouseEvent) {
    if (this.dropdownOnHover && this.overlayRef && this.isCursorInsideDropdown(event)) {
      clearTimeout(this.leaveTimeout);
    }
  }

  @Input()
  set isOpen(value: boolean) {
    if (value !== this._isOpen) {
      this._isOpen = value;
      this.isOpenChange.emit(this._isOpen);

      if (this.isBrowser) {
        if (value) {
          this.openDropdown();
        } else {
          this.closeDropdown();
        }
      }
    }
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  public ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (this.isBrowser && this.overlayRef && this.dropdownCloseOnRouteChange && event instanceof NavigationStart) {
        this.closeDropdown();
      }
    });

    if (this.isBrowser) {
      fromEvent<MouseEvent>(document, "click").subscribe((event: MouseEvent) => {
        if (this.overlayRef && !this.elementRef.nativeElement.contains(event.target)) {
          if (!this.overlayRef.overlayElement.contains(event.target)) {
            setTimeout(() => {
              this.closeDropdown();
            }, this.dropdownHideDelay);
          }
        }
      });

      fromEvent<MouseEvent>(document, "click").subscribe((event: MouseEvent) => {
        if (this.overlayRef && this.dropdownCloseOnClickInside && this.isCursorInsideDropdown(event)) {
          setTimeout(() => {
            this.closeDropdown();
          }, this.dropdownHideDelay);
        }
      });
    }
  }

  private openDropdown(): void {
    if (this.overlayRef) return;

    const overlayConfig = this.getOverlayConfig();
    this.overlayRef = this.overlay.create(overlayConfig);
    const templatePortal = new TemplatePortal(this.dropdownTrigger.templateRef, this.viewContainerRef);
    this.overlayRef.attach(templatePortal);

    setTimeout(() => {
      this.overlayRef.overlayElement.classList.add("visible");
    });

    this._isOpen = true;
    this.isOpenChange.emit(true);
  }

  private closeDropdown(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = null;

      this._isOpen = false;
      this.isOpenChange.emit(false);
      this.dropdownClosed.emit();
    }
  }

  private isCursorInsideDropdown(event: MouseEvent): boolean {
    const dropdownElement = this.overlayRef ? this.overlayRef.overlayElement : null;
    const dropdownElementRect = dropdownElement ? dropdownElement.getBoundingClientRect() : null;

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
          originY: "bottom",
          overlayX: this.direction,
          overlayY: "top",
          offsetY: this.dropdownOffset,
        },
      ]);

    return new OverlayConfig({
      panelClass: this.dropdownPanelClass,
      hasBackdrop: false,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }

  ngOnDestroy() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
