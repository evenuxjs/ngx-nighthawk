import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  viewChild,
  output
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { NighthawkFormControlDirective } from '../../directives/form-control.directive';
import { NighthawkCheckboxComponent } from '../../components/checkbox/checkbox.component';

@Component({
  standalone: true,
  selector: 'nighthawk-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    NighthawkFormControlDirective,
    NighthawkCheckboxComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkMultiSelectComponent),
      multi: true,
    },
  ],
  animations: [
    trigger('dropdownAnimation', [
      state(
        'void',
        style({
          transform: 'scaleY(0)',
          opacity: 0,
          transformOrigin: 'top',
        })
      ),
      state(
        '*',
        style({
          transform: 'scaleY(1)',
          opacity: 1,
          transformOrigin: 'top',
        })
      ),
      transition('void <=> *', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class NighthawkMultiSelectComponent
  implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor
{
  readonly trigger = viewChild.required<ElementRef>('trigger');

  @Input() selectedValue: any[] = [];
  @Input() hasSearch: boolean = false;
  @Input() placeholder: string = '';
  @Input() searchPlaceholder: string = '';
  @Input() emptyResultsLabel: string = 'No results found...';
  @Input() options: any[] = [];
  @Input() nameField: string = '';
  @Input() valueField: string = '';
  @Input() color: 'primary' | 'secondary' | 'dark' | 'light' | 'transparent' =
    'primary';
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() rounded: boolean = false;
  @Input() border: boolean = false;
  @Input() controlToCheckForErrors!: any;
  @Input() isDisabled!: boolean;

  readonly onOptionSelect = output<any[]>();
  readonly onSearchValue = output<string>();

  public selectedOptions: any[] = [];
  public showingOptions: boolean = false;
  public filteredOptions: any[] = [];
  public parentWidth: number = 0;
  public selectedDisplayValue: string = '';

  public onModelChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  private isBrowser: boolean = false;

  constructor(
    protected readonly viewportRuler: ViewportRuler,
    protected readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
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

  ngOnInit(): void {
    this.filteredOptions = JSON.parse(JSON.stringify(this.options));
    this.updateDisplayValue();
  }

  ngAfterViewInit(): void {
    this.measureParentWidth();
  }

  ngOnChanges(): void {
    this.filteredOptions = JSON.parse(JSON.stringify(this.options));
    this.updateSelectedOptions();
    this.updateDisplayValue();
  }

  writeValue(value: any[]): void {
    this.selectedValue = value || [];
    this.updateSelectedOptions();
    this.updateDisplayValue();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggleDropdown(): void {
    if (!this.isDisabled) {
      this.showingOptions = !this.showingOptions;
      if (this.showingOptions) {
        this.measureParentWidth();
      }
    }
  }

  onSearch(event: any): void {
    const searchString = event.target.value;
    this.onSearchValue.emit(searchString);
    this.filterOptions(searchString);
    if (!this.showingOptions) {
      this.showOptions();
    }
  }

  showOptions(): void {
    this.showingOptions = true;
    this.measureParentWidth();
  }

  onBlur(): void {
    this.hideOptions();
    this.onTouched();
  }

  hideOptions(force?: boolean): void {
    if (!this.showingOptions || force) {
      this.showingOptions = false;
      this.onTouched();
    }
  }

  selectOption(option: any = null): void {
    if (option) {
      option.selected = !option.selected;
      this.onOptionChange(option);
    }
  }

  onOptionChange(option: any): void {
    if (option.selected) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions = this.selectedOptions.filter(
        (opt) => opt !== option
      );
    }

    this.selectedValue = this.selectedOptions.map(
      (opt) => opt[this.valueField]
    );
    this.onModelChange(this.selectedValue);
    this.onOptionSelect.emit(this.selectedValue);
    this.updateDisplayValue();
  }

  private filterOptions(value: string): void {
    const options = JSON.parse(JSON.stringify(this.options));
    this.filteredOptions = options.filter((option: any) =>
      option[this.nameField].toLowerCase().includes(value.toLowerCase())
    );
  }

  private updateSelectedOptions(): void {
    this.selectedOptions = this.options.filter((option) =>
      this.selectedValue.includes(option[this.valueField])
    );
  }

  private updateDisplayValue(): void {
    this.selectedDisplayValue = this.selectedOptions
      .map((opt) => opt[this.nameField])
      .join(', ');
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

  trackByValue(index: number, item: any): any {
    return item[this.valueField];
  }
}
