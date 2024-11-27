import { EventEmitter, TemplateRef } from '@angular/core';

export interface DropdownPanel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateRef: TemplateRef<any>;
  readonly closed: EventEmitter<void>;
}
