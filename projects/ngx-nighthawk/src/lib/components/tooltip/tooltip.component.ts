import { Component, Input } from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-tooltip",
  styleUrls: ["./tooltip.component.scss"],
  templateUrl: "./tooltip.component.html",
  animations: [
    trigger("tooltip", [
      transition(":enter", [style({ opacity: 0 }), animate(300, style({ opacity: 1 }))]),
      transition(":leave", [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
  standalone: true,
})
export class NighthawkTooltipComponent {
  @Input() text = "";
}
