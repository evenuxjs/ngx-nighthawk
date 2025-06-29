/* eslint-disable @typescript-eslint/no-unused-vars */

import { isPlatformBrowser } from "@angular/common";
import { Injectable, PLATFORM_ID, inject } from "@angular/core";
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NighthawkRouteSwitchGuard implements CanDeactivate<any> {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private minimumRouteSwitchLoadingTime = 500;
  private isBrowser = false;

  constructor() {
    const platformId = this.platformId;

    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const element = document.querySelector(":root") || false;
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        this.minimumRouteSwitchLoadingTime = +computedStyle.getPropertyValue("--minimum-route-switch-loading-time");
      }
    }
  }

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>((resolve) => {
      if (this.minimumRouteSwitchLoadingTime >= 500) {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      } else {
        resolve(true);
      }
    });
  }
}
