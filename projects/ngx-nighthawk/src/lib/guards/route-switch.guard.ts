/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NighthawkRouteSwitchGuard implements CanDeactivate<any> {
  private minimumRouteSwitchLoadingTime: number = 500;
  private isBrowser: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const element = document.querySelector(':root') || false;
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        this.minimumRouteSwitchLoadingTime = +computedStyle.getPropertyValue(
          '--minimum-route-switch-loading-time'
        );
      }
    }
  }

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
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
