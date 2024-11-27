/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Injectable({
  providedIn: 'root',
})
export class NighthawkDialogService {
  constructor(private readonly dialog: Dialog) {}

  public open(reference: any, config?: any): DialogRef {
    return this.dialog.open(reference, config);
  }
}
