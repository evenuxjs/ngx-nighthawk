import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  PLATFORM_ID,
  ViewContainerRef,
  AfterViewInit,
  inject,
} from "@angular/core";
import { Overlay, OverlayConfig } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { DropdownPanel } from "../interfaces/dropdown-panel.interface";
import { isPlatformBrowser } from "@angular/common";

@Directive({
  selector: "[nighthawkControlledDropdownTrigger]",
  standalone: true,
})
export class NighthawkControlledDropdownTriggerDirective implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  private overlayRef: any;
  private isBrowser: boolean;

  @Input() public dropdownTrigger!: DropdownPanel;
  @Input() public isOpen = false;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && this.isOpen) {
      this.createOverlay();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser && changes["isOpen"]) {
      if (this.isOpen && !this.overlayRef) {
        this.createOverlay();
      } else if (!this.isOpen && this.overlayRef) {
        this.overlayRef.detach();
        this.overlayRef = null;
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.updateOverlayWidth();
    }
  }

  private createOverlay(): void {
    const overlayConfig = this.getOverlayConfig();
    this.overlayRef = this.overlay.create(overlayConfig);
    const templatePortal = new TemplatePortal(this.dropdownTrigger.templateRef, this.viewContainerRef);
    this.overlayRef.attach(templatePortal);
    this.updateOverlayWidth();
  }

  private updateOverlayWidth(): void {
    if (this.overlayRef && this.elementRef.nativeElement) {
      const triggerElement = this.elementRef.nativeElement;
      const width = triggerElement.offsetWidth;
      this.overlayRef.updateSize({ width });
    }
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top",
        },
      ]);

    return new OverlayConfig({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
