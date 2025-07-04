import { Injectable, inject } from "@angular/core";
import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { NighthawkConfirmationComponent } from "../components/confirmation/confirmation.component";

@Injectable({
  providedIn: "root",
})
export class NighthawkConfirmationService {
  private readonly dialog = inject(Dialog);

  public show(title: string, text: string, submitText: string, cancelText: string): DialogRef<unknown, NighthawkConfirmationComponent> {
    return this.dialog.open(NighthawkConfirmationComponent, {
      disableClose: true,
      closeOnNavigation: true,
      data: {
        text: text,
        title: title,
        submitText: submitText,
        cancelText: cancelText,
      },
    });
  }
}
