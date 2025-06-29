export interface ApplicationConfig {
  readonly fonts: string[];
  readonly timezone: string;
  readonly databaseTimezone: string;
  readonly pageLoaderEnabled: boolean;
  readonly routeLoaderEnabled: boolean;
  readonly minimumLoaderTime: number;
  readonly pageLoaderSize: number;
  readonly manualLoader: boolean;
  readonly pageLoaderCustomImagePath: string | false;
  readonly pageLoaderType: string;
  readonly i18nPhrases?: {
    weekDaysMid: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    weekDaysShort: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    monthNames: {
      january: string;
      february: string;
      march: string;
      april: string;
      may: string;
      june: string;
      july: string;
      august: string;
      september: string;
      october: string;
      november: string;
      december: string;
    };
    dateSelector: {
      closeButtonText: string;
      buttonSelectDateText: string;
      buttonSelectMonthText: string;
      buttonSelectYearText: string;
    };
    dateSelectDialog: {
      selectDatesText: string;
      selectADateText: string;
      selectARangeText: string;
      selectAStartDateText: string;
      selectAnEndDateText: string;
      clearText: string;
      closeText: string;
      submitText: string;
    };
  };
}
