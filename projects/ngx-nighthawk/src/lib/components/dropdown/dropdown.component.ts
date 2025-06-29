import { Component, Output, TemplateRef, ViewChild, EventEmitter, Input } from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { DropdownPanel } from "../../interfaces/dropdown-panel.interface";

@Component({
  standalone: true,
  selector: "nighthawk-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
  animations: [
    trigger("dropdownAnimation", [
      state(
        "void",
        style({
          transform: "scaleY(0)",
          opacity: 0,
          transformOrigin: "top",
        }),
      ),
      state(
        "*",
        style({
          transform: "scaleY(1)",
          opacity: 1,
          transformOrigin: "top",
        }),
      ),
      transition("void <=> *", [animate("300ms ease-in-out")]),
    ]),
  ],
})
export class NighthawkDropdownComponent implements DropdownPanel {
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
  @Output() closed = new EventEmitter<void>();
  @Input() closeOnClickInside = false;
  @Input() offset = "0px";

  public handleClick(): void {
    if (this.closeOnClickInside) {
      this.closed.emit();
    }
  }
}
