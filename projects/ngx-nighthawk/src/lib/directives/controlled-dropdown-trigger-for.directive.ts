/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DropdownPanel } from '../interfaces/dropdown-panel.interface';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[nighthawk-controlled-dropdown-trigger]',
  standalone: true,
})
export class NighthawkControlledDropdownTriggerDirective implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  private overlayRef: any;
  private isBrowser: boolean;

  @Input() public dropdownTrigger!: DropdownPanel;
  @Input() public isOpen: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && this.isOpen) {
      this.createOverlay();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser && changes['isOpen']) {
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
    const templatePortal = new TemplatePortal(
      this.dropdownTrigger.templateRef,
      this.viewContainerRef
    );
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
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
      ]);

    return new OverlayConfig({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
