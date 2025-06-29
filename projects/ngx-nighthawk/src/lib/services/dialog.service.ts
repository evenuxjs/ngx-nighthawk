import { Injectable, inject } from "@angular/core";
import { Dialog, DialogRef } from "@angular/cdk/dialog";

@Injectable({
  providedIn: "root",
})
export class NighthawkDialogService {
  private readonly dialog = inject(Dialog);

  public open(reference: any, config?: any): DialogRef {
    return this.dialog.open(reference, config);
  }
}
