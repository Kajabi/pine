export interface DatepickerChangeEventDetail {
  /**
   * The selected date as `YYYY-MM-DD`, or in range mode the range as `YYYY-MM-DD/YYYY-MM-DD`; with
   * the time picker, each date as `YYYY-MM-DDTHH:mm`. An empty string when cleared.
   */
  value: string;
  /** Range mode: the first day of the range, `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` with the time picker. */
  start?: string;
  /** Range mode: the last day of the range, `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` with the time picker. */
  end?: string;
  /**
   * Range mode: the key of the preset the range matches, such as `last-30-days`, so a filter can
   * keep the range relative to today.
   */
  preset?: string;
}

export interface DatepickerPreset {
  /**
   * A built-in key (`today`, `yesterday`, `last-7-days`, `last-30-days`, `last-90-days`,
   * `this-month`, `last-month`, `this-quarter`, `last-quarter`, `this-year`, `last-year`,
   * `year-to-date`, `last-12-months`), or your own key when `start` and `end` are set.
   */
  key: string;
  /** The text shown in the list. Built-in keys have English defaults; set it to translate them. */
  label?: string;
  /** For a preset of your own: its first day, `YYYY-MM-DD`. */
  start?: string;
  /** For a preset of your own: its last day, `YYYY-MM-DD`. */
  end?: string;
}
