import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-timezone';
import { NighthawkBootstrapService } from '../services/bootstrap.service';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class NighthawkDateFormatPipe implements PipeTransform {
  constructor(private readonly nighthawk: NighthawkBootstrapService) {}

  transform(
    value: any,
    format: string = 'DD.MM.YYYY',
    isDatabaseTimezone?: boolean
  ): any {
    const timezone =
      this.nighthawk.config.timezone === 'guess'
        ? moment.tz.guess()
        : this.nighthawk.config.timezone;

    return moment(value)
      .tz(
        isDatabaseTimezone ? this.nighthawk.config.databaseTimezone : timezone
      )
      .format(format);
  }
}
