import { Component, inject } from "@angular/core";
import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { NighthawkButtonDirective } from "../../directives/button.directive";

@Component({
  standalone: true,
  imports: [NighthawkButtonDirective],
  selector: "nighthawk-notification",
  templateUrl: "notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NighthawkNotificationComponent {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef<void>>(DialogRef);
}
