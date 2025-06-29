import { EventEmitter, TemplateRef } from "@angular/core";

export interface DropdownPanel {
  templateRef: TemplateRef<any>;
  readonly closed: EventEmitter<void>;
}
