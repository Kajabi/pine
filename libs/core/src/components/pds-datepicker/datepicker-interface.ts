export interface DatepickerChangeEventDetail {
  /**
   * The selected date as `YYYY-MM-DD`, or in range mode the range as `YYYY-MM-DD/YYYY-MM-DD`; with
   * the time picker, each date as `YYYY-MM-DDTHH:mm`; with `month-day`, `--MM-DD`. An empty string
   * when cleared.
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
   * `year-to-date`, `last-12-months`), or your own key when it has `startOffset` or `endOffset`,
   * or both `start` and `end`.
   */
  key: string;
  /**
   * The text shown in the list. Built-in keys have English defaults; set it to translate them. A key
   * of your own needs one, or it is left out of the list.
   */
  label?: string;
  /**
   * For a preset of your own that follows today: its first day, in whole days from today, so `-6`
   * is six days ago and `0` is today. Resolved against today every time the list is read, as a
   * built-in is, so the range stays relative however long the page stays open. Set one offset and
   * the other is today.
   */
  startOffset?: number;
  /** For a preset of your own that follows today: its last day, in whole days from today. */
  endOffset?: number;
  /**
   * For a preset of your own on fixed days: its first day, `YYYY-MM-DD`. Fixed days do not follow
   * today, so prefer `startOffset` and `endOffset` for a range meant to stay relative.
   */
  start?: string;
  /** For a preset of your own on fixed days: its last day, `YYYY-MM-DD`. */
  end?: string;
}
