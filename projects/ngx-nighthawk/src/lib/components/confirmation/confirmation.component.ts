import { Component, inject } from "@angular/core";
import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { NighthawkButtonDirective } from "../../directives/button.directive";

@Component({
  standalone: true,
  imports: [NighthawkButtonDirective],
  selector: "nighthawk-confirmation",
  templateUrl: "confirmation.component.html",
  styleUrls: ["./confirmation.component.scss"],
})
export class NighthawkConfirmationComponent {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef<boolean>>(DialogRef);
}
