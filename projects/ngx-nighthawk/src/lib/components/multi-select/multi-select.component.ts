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
import { NighthawkCheckboxComponent } from "../../components/checkbox/checkbox.component";

@Component({
  standalone: true,
  selector: "nighthawk-multi-select",
  templateUrl: "./multi-select.component.html",
  styleUrls: ["./multi-select.component.scss"],
  imports: [CommonModule, OverlayModule, FormsModule, ReactiveFormsModule, NighthawkFormControlDirective, NighthawkCheckboxComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkMultiSelectComponent),
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
export class NighthawkMultiSelectComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {
  protected readonly viewportRuler = inject(ViewportRuler);
  protected readonly changeDetectorRef = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  readonly trigger = viewChild.required<ElementRef>("trigger");

  @Input() selectedValue: any[] = [];
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

  readonly onOptionSelect = output<any[]>();
  readonly onSearchValue = output<string>();

  public selectedOptions: any[] = [];
  public showingOptions = false;
  public filteredOptions: any[] = [];
  public parentWidth = 0;
  public selectedDisplayValue = "";

  public onModelChange: (value: unknown) => void = () => {};
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
    this.filteredOptions = JSON.parse(JSON.stringify(this.options));
    this.updateDisplayValue();
  }

  public ngAfterViewInit(): void {
    this.measureParentWidth();
  }

  public ngOnChanges(): void {
    this.filteredOptions = JSON.parse(JSON.stringify(this.options));
    this.updateSelectedOptions();
    this.updateDisplayValue();
  }

  public writeValue(value: any[]): void {
    this.selectedValue = value || [];
    this.updateSelectedOptions();
    this.updateDisplayValue();
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public toggleDropdown(): void {
    if (!this.isDisabled) {
      this.showingOptions = !this.showingOptions;
      if (this.showingOptions) {
        this.measureParentWidth();
      }
    }
  }

  public onSearch(event: any): void {
    if (!event || !event.target) return;

    const searchString = event.target.value ?? "";
    this.onSearchValue.emit(searchString);
    this.filterOptions(searchString);

    if (!this.showingOptions) {
      this.showOptions();
    }
  }

  public showOptions(): void {
    this.showingOptions = true;
    this.measureParentWidth();
  }

  public onBlur(): void {
    this.hideOptions();
    this.onTouched();
  }

  public hideOptions(force?: boolean): void {
    if (!this.showingOptions || force) {
      this.showingOptions = false;
      this.onTouched();
    }
  }

  public selectOption(option: any = null): void {
    if (option) {
      option.selected = !option.selected;
      this.onOptionChange(option);
    }
  }

  public onOptionChange(option: any): void {
    if (option.selected) {
      const alreadySelected = this.selectedOptions.some((opt) => opt[this.valueField] === option[this.valueField]);
      if (!alreadySelected) {
        this.selectedOptions.push(option);
      }
    } else {
      this.selectedOptions = this.selectedOptions.filter((opt) => opt[this.valueField] !== option[this.valueField]);
    }

    this.selectedValue = this.selectedOptions.map((opt) => opt[this.valueField]);

    this.onModelChange(this.selectedValue);
    this.onOptionSelect.emit(this.selectedValue);

    this.updateDisplayValue();
  }

  private filterOptions(value: string): void {
    const options = JSON.parse(JSON.stringify(this.options));
    this.filteredOptions = options.filter((option: any) => option[this.nameField].toLowerCase().includes(value.toLowerCase()));
  }

  private updateSelectedOptions(): void {
    this.selectedOptions = this.options.filter((option) => this.selectedValue.includes(option[this.valueField]));

    this.options.forEach((option) => {
      option.selected = this.selectedValue.includes(option[this.valueField]);
    });

    this.filteredOptions = [...this.options];
  }

  private updateDisplayValue(): void {
    this.selectedDisplayValue = this.selectedOptions.map((opt) => opt[this.nameField]).join(", ");
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

  public trackByValue(index: number, item: any): any {
    return item[this.valueField];
  }
}
