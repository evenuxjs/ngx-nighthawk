import { Injectable, Renderer2, RendererFactory2, inject } from "@angular/core";
import Swiper from "swiper";
import { Navigation, Zoom } from "swiper/modules";

Swiper.use([Navigation, Zoom]);

@Injectable({
  providedIn: "root",
})
export class NighthawkLightboxService {
  private rendererFactory = inject(RendererFactory2);

  private renderer: Renderer2;
  private lightboxContainer: HTMLElement | null = null;
  private images: string[] = [];
  private currentIndex = 0;
  private swiper: Swiper | null = null;
  private escapeListener!: () => void;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  open(images: string[], startIndex = 0): void {
    this.images = images;
    this.currentIndex = startIndex;
    this.createLightbox();
    this.bindKeyboardEvents();
  }

  close(): void {
    if (this.lightboxContainer) {
      if (this.swiper) {
        this.swiper.destroy(true, true);
        this.swiper = null;
      }
      this.renderer.removeChild(document.body, this.lightboxContainer);
      this.lightboxContainer = null;

      if (this.escapeListener) {
        this.escapeListener();
      }
    }
  }

  private createLightbox(): void {
    const uniqueId = `swiper-${Date.now()}`;
    this.lightboxContainer = this.renderer.createElement("div");
    this.renderer.addClass(this.lightboxContainer, "lightbox-container");
    this.renderer.addClass(this.lightboxContainer, "hidden");

    // Create close button
    const closeButton = this.renderer.createElement("button");
    this.renderer.addClass(closeButton, "lightbox-close");
    this.renderer.listen(closeButton, "click", () => this.close());
    closeButton.innerHTML = '<i class="fa fa-times"></i>';
    this.renderer.appendChild(this.lightboxContainer, closeButton);

    // Create spinner
    const spinner = this.renderer.createElement("div");
    this.renderer.addClass(spinner, "spinner");
    spinner.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>';
    this.renderer.appendChild(this.lightboxContainer, spinner);

    // Create Swiper container
    const swiperWrapper = this.renderer.createElement("div");
    this.renderer.addClass(swiperWrapper, "swiper");
    this.renderer.setAttribute(swiperWrapper, "id", uniqueId);

    const swiperWrapperInner = this.renderer.createElement("div");
    this.renderer.addClass(swiperWrapperInner, "swiper-wrapper");

    let loadedImagesCount = 0;

    for (const image of this.images) {
      const slide = this.renderer.createElement("div");
      this.renderer.addClass(slide, "swiper-slide");

      const zoomContainer = this.renderer.createElement("div");
      this.renderer.addClass(zoomContainer, "swiper-zoom-container");

      const imgElement = this.renderer.createElement("img");
      imgElement.src = image;

      this.renderer.listen(zoomContainer, "wheel", (event: WheelEvent) => {
        event.preventDefault();
        if (this.swiper) {
          const zoomLevel = this.swiper.zoom.scale || 1;
          const newZoomLevel = event.deltaY < 0 ? zoomLevel * 1.1 : zoomLevel / 1.1;
          this.swiper.zoom.in(newZoomLevel < 1 ? 1 : newZoomLevel);
        }
      });

      this.renderer.listen(imgElement, "load", () => {
        loadedImagesCount++;
        if (loadedImagesCount === this.images.length) {
          this.renderer.removeChild(this.lightboxContainer, spinner);
          this.renderer.removeClass(this.lightboxContainer, "hidden");
          this.initializeSwiper(`#${uniqueId}`);
        }
      });

      this.renderer.appendChild(zoomContainer, imgElement);
      this.renderer.appendChild(slide, zoomContainer);
      this.renderer.appendChild(swiperWrapperInner, slide);
    }

    this.renderer.appendChild(swiperWrapper, swiperWrapperInner);

    // Add navigation buttons
    const prevButton = this.renderer.createElement("div");
    this.renderer.addClass(prevButton, "swiper-button-prev");
    prevButton.setAttribute("id", `${uniqueId}-prev`);
    this.renderer.appendChild(swiperWrapper, prevButton);

    const nextButton = this.renderer.createElement("div");
    this.renderer.addClass(nextButton, "swiper-button-next");
    nextButton.setAttribute("id", `${uniqueId}-next`);
    this.renderer.appendChild(swiperWrapper, nextButton);

    this.renderer.appendChild(this.lightboxContainer, swiperWrapper);
    this.renderer.appendChild(document.body, this.lightboxContainer);
  }

  private initializeSwiper(selector: string): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }

    const container = document.querySelector(selector) as HTMLElement;
    const nextButton = container?.querySelector(".swiper-button-next") as HTMLElement;
    const prevButton = container?.querySelector(".swiper-button-prev") as HTMLElement;

    this.swiper = new Swiper(selector, {
      initialSlide: this.currentIndex,
      zoom: true,
      speed: 300,
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
    });

    this.swiper.on("slideChange", () => {
      this.currentIndex = this.swiper?.activeIndex || 0;
    });
  }

  private bindKeyboardEvents(): void {
    this.escapeListener = this.renderer.listen("document", "keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        this.close();
      } else if (event.key === "ArrowLeft") {
        this.swiper?.slidePrev();
      } else if (event.key === "ArrowRight") {
        this.swiper?.slideNext();
      }
    });
  }
}
