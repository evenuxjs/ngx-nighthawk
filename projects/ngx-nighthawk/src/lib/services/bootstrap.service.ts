import { ComponentRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NighthawkLoaderComponent } from '../../public-api';
import { isPlatformBrowser } from '@angular/common';
import { ApplicationConfig } from '../interfaces/application-config.interface';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NighthawkBootstrapService {
  public vcr!: any;

  // Config
  public config!: ApplicationConfig;

  // Loader
  private loaderRef!: ComponentRef<NighthawkLoaderComponent>;

  // Hook checks
  private isBackgroundImagesLoaded: boolean = false;
  private isImagesLoaded: boolean = false;
  private isFontsLoaded = false;

  // Initial fonts
  private fonts: string[] = [];

  // Timer
  private startTime: number = 0;

  // Sanity check
  private isFirstLoad: boolean = true;
  private isBrowser: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.router.events.subscribe((event) => {
        if ((event as any).navigationTrigger !== 'popstate') {
          if (this.config.routeLoaderEnabled && !this.isFirstLoad) {
            if (event instanceof NavigationStart) {
              // Reset cache
              this.isBackgroundImagesLoaded = false;
              this.isImagesLoaded = false;
              this.isFontsLoaded = false;

              // Reset timer
              this.startTime = Date.now();

              // Place hooks
              this.placeBackgroundImageLoaderHook();
              this.placeImageLoaderHook();
              this.placeFontsHook();

              // Show loader
              this.showLoaderWithFadeIn();

              if (!this.config.manualLoader) {
                // Start finalization hook
                this.checkForFinalization();
              }
            }
          }
        }
      });
    }
  }

  public async loadApplication(config: ApplicationConfig): Promise<void> {
    this.config = config;
    this.fonts = config.fonts;

    if (this.isBrowser && config.pageLoaderEnabled) {
      // Set as "loading"
      document.body.classList.add('loading');

      // Start timer
      this.startTime = Date.now();

      setTimeout(() => {
        // Place hooks (timeout to wait for DOM)
        this.placeBackgroundImageLoaderHook();
        this.placeImageLoaderHook();
        this.placeFontsHook();
      });

      // Show loader
      this.showLoader();

      if (!config.manualLoader) {
        // Start finalization hook
        this.checkForFinalization();
      }
    } else if (this.isBrowser && !config.pageLoaderEnabled) {
      const mainElement = document.querySelector('main');
      if (mainElement) mainElement.classList.add('is-loaded');
    }
  }

  public setVcrInstance(vcr: any): void {
    this.vcr = vcr;
  }

  public pageLoaded(): void {
    this.checkForFinalization();
  }

  private showLoader(): void {
    this.loaderRef = this.vcr.createComponent(NighthawkLoaderComponent);
    this.loaderRef.setInput('isPageLoader', true);
    this.loaderRef.setInput('size', this.config.pageLoaderSize);
  }

  private showLoaderWithFadeIn(): void {
    this.loaderRef = this.vcr.createComponent(NighthawkLoaderComponent);
    this.loaderRef.setInput('isPageLoader', true);
    this.loaderRef.setInput('size', this.config.pageLoaderSize);
    this.loaderRef.setInput('isHidden', true);

    setTimeout(() => {
      // Make main element visible
      const mainElement = document.querySelector('main');
      if (mainElement) mainElement.classList.remove('is-loaded');

      this.loaderRef.setInput('isHidden', false);
    });
  }

  private checkForFinalization(): void {
    const timePassed = Date.now() - this.startTime;

    if (
      // Check if hooks finished & min loading time hit
      this.isBackgroundImagesLoaded &&
      this.isImagesLoaded &&
      this.isFontsLoaded &&
      timePassed >= this.config.minimumLoaderTime
    ) {
      if (this.isBrowser) {
        document.body.classList.remove('loading');
      }

      // Make main element visible
      const mainElement = document.querySelector('main');
      if (mainElement) mainElement.classList.add('is-loaded');

      // Hide the loader (650ms animation)
      this.loaderRef.setInput('isHidden', true);
      this.loaderRef.instance.isPageLoaderFinished = true;

      // Wait for animation before destroying
      setTimeout(() => {
        this.loaderRef.destroy();
        this.isFirstLoad = false;
      }, 650);
    } else {
      setTimeout(() => {
        this.checkForFinalization();
      }, 100);
    }
  }

  private placeImageLoaderHook(): void {
    if (this.isBrowser) {
      const images = Array.from(document.querySelectorAll('img'));

      const checkImageLoad = () => {
        const allLoaded = images.every((img) => img.complete);
        if (allLoaded) {
          this.isImagesLoaded = true;
        } else {
          setTimeout(checkImageLoad, 100);
        }
      };

      checkImageLoad();
    }
  }

  private async placeBackgroundImageLoaderHook(): Promise<void> {
    if (this.isBrowser) {
      const urls = this.findAllBackgroundImageUrls();
      if (!urls.length) {
        this.isBackgroundImagesLoaded = true;
        return;
      }

      const loadPromises = urls.map((url) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
          img.src = url;
        });
      });

      Promise.all(loadPromises)
        .then(() => {
          this.isBackgroundImagesLoaded = true;
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });
    }
  }

  private placeFontsHook(): void {
    const fontFamilies = this.fonts;
    if (!fontFamilies.length) {
      this.isFontsLoaded = true;
      return;
    }

    if (this.isBrowser) {
      const checkFonts = () => {
        for (const fontFamily of fontFamilies) {
          let fontLoaded = false;
          document.fonts.ready.then(() => {
            document.fonts.forEach((fontFace) => {
              if (
                fontFace.family === fontFamily &&
                fontFace.status === 'loaded'
              ) {
                fontLoaded = true;
              }
            });

            if (!fontLoaded) {
              return false;
            }

            return true;
          });
        }

        return true;
      };

      const interval = setInterval(() => {
        if (checkFonts()) {
          clearInterval(interval);
          this.isFontsLoaded = true;
        }
      }, 100);
    }
  }

  private findAllBackgroundImageUrls(): string[] {
    const urls: string[] = [];
    const allElements = document.querySelectorAll('*');

    allElements.forEach((element) => {
      const style = window.getComputedStyle(element);
      const backgroundImage = style.getPropertyValue('background-image');

      // Extract URL from `url("...")`
      const matches = backgroundImage.match(/url\(["']?(.*?)["']?\)/);

      if (matches && matches[1]) {
        urls.push(matches[1]);
      }
    });

    return urls;
  }
}
