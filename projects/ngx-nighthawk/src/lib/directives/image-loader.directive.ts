import { isPlatformBrowser } from "@angular/common";
import { Directive, Input, ElementRef, Renderer2, OnInit, OnChanges, SimpleChanges, NgZone, PLATFORM_ID, inject } from "@angular/core";

@Directive({
  selector: "img[nighthawkImageLoader]",
  standalone: true,
})
export class NighthawkImageLoaderDirective implements OnInit, OnChanges {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private zone = inject(NgZone);

  @Input() imageSrc!: string;
  @Input() width!: number;
  @Input() height!: number;

  private loaderElement!: HTMLElement;
  private wrapperElement!: HTMLElement;

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createWrapper();
      this.createLoader();
      this.loadImage();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["imageSrc"]) {
      this.loadImage();
    }
    if (changes["width"] || changes["height"]) {
      this.setAspectRatio();
    }
  }

  private createWrapper(): void {
    this.wrapperElement = this.renderer.createElement("div");
    this.renderer.addClass(this.wrapperElement, "image-loader");
    this.renderer.setStyle(this.wrapperElement, "position", "relative");
    this.renderer.setStyle(this.wrapperElement, "display", "inline-block");

    this.setAspectRatio();

    this.renderer.insertBefore(this.el.nativeElement.parentNode, this.wrapperElement, this.el.nativeElement);

    this.renderer.appendChild(this.wrapperElement, this.el.nativeElement);
  }

  private setAspectRatio(): void {
    const aspectRatio = this.width && this.height ? `${this.width} / ${this.height}` : "16 / 9";
    this.renderer.setStyle(this.wrapperElement, "aspect-ratio", aspectRatio);
    this.renderer.setStyle(this.wrapperElement, "width", `100%`);
    this.renderer.setStyle(this.wrapperElement, "height", `100%`);
  }

  private createLoader(): void {
    this.loaderElement = this.renderer.createElement("div");
    this.renderer.addClass(this.loaderElement, "image-loader-spinner");
    this.renderer.setStyle(this.loaderElement, "position", "absolute");
    this.renderer.setStyle(this.loaderElement, "top", "50%");
    this.renderer.setStyle(this.loaderElement, "left", "50%");
    this.renderer.setStyle(this.loaderElement, "transform", "translate(-50%, -50%)");
    this.renderer.setStyle(this.loaderElement, "z-index", "10");

    const icon = this.renderer.createElement("i");
    this.renderer.addClass(icon, "fa");
    this.renderer.addClass(icon, "fa-circle-o-notch");
    this.renderer.addClass(icon, "fa-spin");
    this.renderer.setStyle(icon, "font-size", "24px");

    this.renderer.appendChild(this.loaderElement, icon);
    this.renderer.appendChild(this.wrapperElement, this.loaderElement);
  }

  private loadImage(): void {
    this.renderer.setStyle(this.el.nativeElement, "opacity", "0");

    this.renderer.setAttribute(this.el.nativeElement, "src", this.imageSrc);

    const loadListener = this.renderer.listen(this.el.nativeElement, "load", () => {
      this.onLoad();
      loadListener();
    });

    const errorListener = this.renderer.listen(this.el.nativeElement, "error", () => {
      this.onError();
      errorListener();
    });
  }

  private onLoad(): void {
    this.zone.run(() => {
      this.renderer.setStyle(this.loaderElement, "transition", "opacity 0.5s");
      this.renderer.setStyle(this.loaderElement, "opacity", "0");

      this.renderer.setStyle(this.el.nativeElement, "transition", "opacity 0.5s");
      this.renderer.setStyle(this.el.nativeElement, "opacity", "1");

      setTimeout(() => {
        this.renderer.removeChild(this.wrapperElement, this.loaderElement);
      }, 500);
    });
  }

  private onError(): void {
    this.zone.run(() => {
      this.renderer.removeChild(this.wrapperElement, this.loaderElement);
      this.renderer.setProperty(this.el.nativeElement, "alt", "Image failed to load");
    });
  }
}
