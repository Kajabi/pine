import { html } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export default {
  args: {
    autoApply: false,
    clearable: false,
    disabled: false,
    errorMessage: null,
    firstDayOfWeek: null,
    format: 'YYYY-MM-DD',
    fullWidth: false,
    helperMessage: null,
    hideLabel: false,
    invalid: false,
    locale: null,
    max: null,
    min: null,
    minuteIncrement: 1,
    name: null,
    presets: null,
    range: false,
    placeholder: null,
    placement: 'bottom-start',
    readonly: false,
    required: false,
    showDropdowns: false,
    timePicker: false,
    value: null,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'top-end'],
    },
    presets: {
      control: 'text',
    },
    pdsDatepickerChange: {
      action: 'pdsDatepickerChange',
    },
  },
  component: 'pds-datepicker',
  parameters: {
    actions: {
      handles: ['pdsDatepickerChange'],
    },
  },
  title: 'components/Datepicker',
};

const BaseTemplate = (args) => html`<pds-datepicker
  ?auto-apply=${args.autoApply}
  ?clearable=${args.clearable}
  component-id="${args.componentId}"
  ?disabled=${args.disabled}
  error-message=${ifDefined(args.errorMessage ?? undefined)}
  first-day-of-week=${ifDefined(args.firstDayOfWeek ?? undefined)}
  format=${ifDefined(args.format ?? undefined)}
  ?full-width=${args.fullWidth}
  helper-message=${ifDefined(args.helperMessage ?? undefined)}
  ?hide-label=${args.hideLabel}
  ?invalid=${args.invalid}
  label="${args.label}"
  locale=${ifDefined(args.locale ?? undefined)}
  max=${ifDefined(args.max ?? undefined)}
  min=${ifDefined(args.min ?? undefined)}
  minute-increment=${ifDefined(args.minuteIncrement ?? undefined)}
  name=${ifDefined(args.name ?? undefined)}
  placeholder=${ifDefined(args.placeholder ?? undefined)}
  placement=${ifDefined(args.placement ?? undefined)}
  presets=${ifDefined(args.presets ?? undefined)}
  ?range=${args.range}
  ?readonly=${args.readonly}
  ?required=${args.required}
  ?show-dropdowns=${args.showDropdowns}
  ?time-picker=${args.timePicker}
  value=${ifDefined(args.value ?? undefined)}>
</pds-datepicker>`;

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'pds-datepicker-default-example',
  label: 'Due date',
};

export const WithValue = BaseTemplate.bind({});
WithValue.args = {
  componentId: 'pds-datepicker-value-example',
  label: 'Due date',
  value: '2026-10-13',
};

export const MinAndMax = BaseTemplate.bind({});
MinAndMax.args = {
  componentId: 'pds-datepicker-range-example',
  helperMessage: 'Pick a day between October 5 and November 20.',
  label: 'Delivery date',
  max: '2026-11-20',
  min: '2026-10-05',
  value: '2026-10-13',
};

export const Locale = BaseTemplate.bind({});
Locale.args = {
  componentId: 'pds-datepicker-locale-example',
  label: "Date d'échéance",
  locale: 'fr',
  value: '2026-10-13',
};

export const Invalid = BaseTemplate.bind({});
Invalid.args = {
  componentId: 'pds-datepicker-invalid-example',
  errorMessage: 'Choose a date after today.',
  invalid: true,
  label: 'Due date',
  value: '2026-10-13',
};

export const Disabled = BaseTemplate.bind({});
Disabled.args = {
  componentId: 'pds-datepicker-disabled-example',
  disabled: true,
  label: 'Due date',
  value: '2026-10-13',
};

export const Range = BaseTemplate.bind({});
Range.args = {
  componentId: 'pds-datepicker-range-mode-example',
  label: 'Period',
  range: true,
};

export const RangeWithPresets = BaseTemplate.bind({});
RangeWithPresets.args = {
  componentId: 'pds-datepicker-range-presets-example',
  hideLabel: true,
  label: 'Period',
  presets: 'today,last-7-days,last-30-days,last-month,this-month,last-quarter,this-quarter,this-year,last-12-months,year-to-date',
  range: true,
};

export const RangeWithTimes = BaseTemplate.bind({});
RangeWithTimes.args = {
  componentId: 'pds-datepicker-range-times-example',
  label: 'Event',
  minuteIncrement: 15,
  range: true,
  timePicker: true,
  value: '2026-10-13T14:00/2026-10-14T22:00',
};

export const MonthAndYearDropdowns = BaseTemplate.bind({});
MonthAndYearDropdowns.args = {
  componentId: 'pds-datepicker-dropdowns-example',
  label: 'Birthday',
  max: '2026-10-13',
  min: '1901-01-01',
  showDropdowns: true,
};

export const InitiallyEmptyWithClear = BaseTemplate.bind({});
InitiallyEmptyWithClear.args = {
  clearable: true,
  componentId: 'pds-datepicker-clearable-example',
  label: 'Created',
  range: true,
};

export const Format = BaseTemplate.bind({});
Format.args = {
  componentId: 'pds-datepicker-format-example',
  format: 'MM/DD/YYYY',
  label: 'Due date',
  value: '2026-10-13',
};

export const RangeAutoApply = BaseTemplate.bind({});
RangeAutoApply.args = {
  autoApply: true,
  componentId: 'pds-datepicker-auto-apply-example',
  label: 'Period',
  presets: 'today,last-7-days,last-30-days',
  range: true,
};

export const Clearable = BaseTemplate.bind({});
Clearable.args = {
  clearable: true,
  componentId: 'pds-datepicker-clearable-single-example',
  label: 'Due date',
  value: '2026-10-13',
};
