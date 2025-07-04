import { AfterViewInit, Component, Input, OnChanges, PLATFORM_ID, SimpleChanges, output, inject } from "@angular/core";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import Swiper from "swiper";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: "nighthawk-swiper",
  templateUrl: "swiper.component.html",
  styleUrls: ["./swiper.component.scss"],
})
export class NighthawkSwiperComponent implements AfterViewInit, OnChanges {
  @Input() activeSlide = 0;

  @Input() config: any = {
    slidesPerView: 1,
    spaceBetween: 40,
    direction: "horizontal",
    loop: false,
    pagination: {
      enabled: false,
    },
    navigation: {
      enabled: false,
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    scrollbar: {
      enabled: false,
    },
  };

  readonly onSwiperInit = output<Swiper>();
  readonly onSlideChange = output<number>();

  public swiper!: Swiper;
  public identifier!: string;

  private isBrowser = false;

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.identifier = this.generateRandomString(12);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ngAfterViewInit(): void {
    if (this.isBrowser) {
      const config = this.config;
      config.modules = [Navigation, Pagination, Autoplay];
      config.slidesPerView = this.config?.slidesPerView || 1;
      config.spaceBetween = this.config?.spaceBetween || 40;

      if (!config.pagination) {
        config.pagination = {};
      }

      config.pagination.el = ".swiper-pagination";

      this.swiper = new Swiper(`.${this.identifier}`, config);
      this.onSwiperInit.emit(this.swiper);

      this.swiper.on("slideChange", (swiper) => {
        this.onSlideChange.emit(swiper.activeIndex);
      });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.swiper && changes["activeSlide"]) {
      this.swiper.slideTo(changes["activeSlide"].currentValue);
    }
  }

  private generateRandomString(length: number): string {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
}
