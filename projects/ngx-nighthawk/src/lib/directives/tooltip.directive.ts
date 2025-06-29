import { ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, inject } from "@angular/core";
import { Overlay, OverlayPositionBuilder, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { NighthawkTooltipComponent } from "../components/tooltip/tooltip.component";
import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Directive({ selector: "[nighthawkTooltip]", standalone: true })
export class NighthawkTooltipDirective implements OnInit, OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);

  @Input() nighthawkTooltip = "";
  @Input() public direction: "start" | "center" | "end" = "center";

  private overlayRef!: OverlayRef;
  private routerSubscription!: Subscription;

  ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder.flexibleConnectedTo(this.elementRef).withPositions([
      {
        originX: this.direction,
        originY: "top",
        overlayX: this.direction,
        overlayY: "bottom",
        offsetY: -8,
      },
    ]);

    this.overlayRef = this.overlay.create({ positionStrategy });

    this.routerSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.hide();
    });
  }

  @HostListener("mouseenter")
  show() {
    const tooltipRef: ComponentRef<NighthawkTooltipComponent> = this.overlayRef.attach(new ComponentPortal(NighthawkTooltipComponent));
    tooltipRef.instance.text = this.nighthawkTooltip;
  }

  @HostListener("mouseout")
  hide() {
    this.overlayRef.detach();
  }

  public ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
