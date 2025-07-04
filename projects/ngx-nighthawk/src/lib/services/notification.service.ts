import { Injectable, inject } from "@angular/core";
import { Dialog } from "@angular/cdk/dialog";
import { NighthawkNotificationComponent } from "../components/notification/notification.component";

@Injectable({
  providedIn: "root",
})
export class NighthawkNotificationService {
  private readonly dialog = inject(Dialog);

  public show(title: string, text: string, closeText: string): void {
    this.dialog.open(NighthawkNotificationComponent, {
      disableClose: true,
      closeOnNavigation: true,
      data: { title: title, text: text, closeText: closeText },
    });
  }
}
