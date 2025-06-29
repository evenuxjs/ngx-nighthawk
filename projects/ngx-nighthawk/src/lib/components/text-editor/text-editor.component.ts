import { Component, Input, forwardRef, output } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  standalone: true,
  imports: [FormsModule, QuillModule],
  selector: 'nighthawk-text-editor',
  templateUrl: 'text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkTextEditorComponent),
      multi: true,
    },
  ],
})
export class NighthawkTextEditorComponent implements ControlValueAccessor {
  @Input() content: string = '';
  @Input() isDisabled: boolean = false;
  @Input() config: any = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction
      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ['clean'], // remove formatting button
      ['link', 'image', 'video'], // link and image, video
    ],
  };

  readonly onContentChange = output<string>();

  public onModelChange: (value: unknown) => void = () => {};

  private onTouched: () => void = () => {};

  public writeValue(value: any): void {
    this.content = value || '';
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onModelChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onStateChange(): void {
    this.onModelChange(this.content);
    this.onTouched();
    this.onContentChange.emit(this.content);
  }
}
