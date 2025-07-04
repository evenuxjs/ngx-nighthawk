import { ViewportRuler } from "@angular/cdk/scrolling";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  PLATFORM_ID,
  viewChild,
  output,
  inject,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OverlayModule } from "@angular/cdk/overlay";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { NighthawkFormControlDirective } from "../../directives/form-control.directive";

@Component({
  standalone: true,
  selector: "nighthawk-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
  imports: [CommonModule, OverlayModule, FormsModule, ReactiveFormsModule, NighthawkFormControlDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkSelectComponent),
      multi: true,
    },
  ],
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
export class NighthawkSelectComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {
  protected readonly viewportRuler = inject(ViewportRuler);
  protected readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly trigger = viewChild.required<ElementRef>("trigger");

  @Input() selectedValue = "";
  @Input() hasSearch = false;
  @Input() placeholder = "";
  @Input() searchPlaceholder = "";
  @Input() emptyResultsLabel = "No results found...";
  @Input() options: any[] = [];
  @Input() nameField = "";
  @Input() valueField = "";
  @Input() color: "primary" | "secondary" | "dark" | "light" | "transparent" = "primary";
  @Input() size: "large" | "medium" | "small" = "medium";
  @Input() rounded = false;
  @Input() border = false;
  @Input() controlToCheckForErrors!: any;
  @Input() isDisabled!: boolean;

  readonly onOptionSelect = output<string>();
  readonly onSearchValue = output<string>();

  public searchString = "";
  public selectedOption: any = null;
  public showingOptions = false;
  public filteredOptions: any[] = [];
  public parentWidth = 0;

  public onModelChange: (value: unknown) => void = () => {};

  private ignoreClose = false;
  private onTouched: () => void = () => {};

  private isBrowser = false;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.viewportRuler
      .change()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.showingOptions) {
          this.measureParentWidth();
        }
      });
  }

  public ngOnInit(): void {
    this.filteredOptions = this.options;
  }

  public ngAfterViewInit(): void {
    this.measureParentWidth();
  }

  public ngOnChanges(): void {
    this.filteredOptions = this.options;
    if (this.selectedOption) {
      const existing = this.filteredOptions.find((option) => {
        return option[this.valueField] === this.selectedOption[this.valueField];
      });

      this.selectedValue = existing ? existing[this.nameField] : "";
    }
  }

  public writeValue(value: unknown): void {
    if (value !== null && value !== undefined && this.options?.length && this.nameField && this.valueField) {
      const option = this.options.find((opt) => opt[this.valueField] == value);
      if (option) {
        this.selectedOption = option;
        this.selectedValue = option[this.nameField];
      } else {
        this.selectedOption = null;
        this.selectedValue = "";
      }
    } else {
      this.selectedOption = null;
      this.selectedValue = "";
    }
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public toggleDropdown(): void {
    if (!this.isDisabled) {
      if (!this.showingOptions) {
        this.showOptions();
      } else {
        this.hideOptions();
      }
    }
  }

  public onSearch(event: any): void {
    this.searchString = event?.target?.value || "";
    this.filterOptions(this.searchString);
    this.onSearchValue.emit(this.searchString);

    if (!this.showingOptions) {
      this.showOptions();
    }
  }

  public showOptions(): void {
    this.showingOptions = true;
    this.measureParentWidth();
  }

  public onBlur(): void {
    this.ignoreClose = true;
    this.selectMatchingOption(this.selectedValue);
    this.onTouched();
  }

  public hideOptions(force?: boolean): void {
    if (!this.ignoreClose || force) {
      this.showingOptions = false;
      this.onTouched();
    }
  }

  public selectOption(index: number | undefined = undefined): void {
    let option = null;
    if (index === undefined) {
      const matchingOption = this.options.find((opt) => opt[this.nameField].toLowerCase() === this.searchString.toLowerCase());

      if (matchingOption) {
        option = matchingOption;
      } else {
        this.selectedOption = null;
        this.selectedValue = "";
        this.ignoreClose = false;
        this.hideOptions();
        this.onTouched();
        return;
      }
    } else {
      option = this.filteredOptions[index];
    }

    if (option?.disabled) {
      return;
    }

    this.selectedOption = option;
    if (option) {
      this.selectedValue = option[this.nameField];

      setTimeout(() => {
        this.onModelChange(option[this.valueField]);
        this.onOptionSelect.emit(option[this.valueField]);
        this.filterOptions("");
      });

      this.ignoreClose = false;
      this.hideOptions();
      this.onTouched();
    }
  }

  private selectMatchingOption(searchString: string): void {
    const matchingOption = this.options.find((option) => option[this.nameField].toLowerCase() === searchString.toLowerCase());

    if (matchingOption) {
      this.selectOption(matchingOption);
    } else {
      this.selectedOption = null;
      this.selectedValue = "";
      this.onModelChange(null);
    }
  }

  private filterOptions(value: string): void {
    this.filteredOptions = this.options.filter((option) => option[this.nameField].toLowerCase().includes(value.toLowerCase()));
  }

  private measureParentWidth(): void {
    const triggerValue = this.trigger();
    if (this.isBrowser && triggerValue) {
      const rect = triggerValue.nativeElement.getBoundingClientRect();
      this.parentWidth = rect.width;
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();
    }
  }
}
