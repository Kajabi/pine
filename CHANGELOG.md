## 3.15.3 (2026-02-03)

### Styles 🎨

- **pds-tab:** display not-allowed cursor for disabled tabs ([#658](https://github.com/Kajabi/pine/pull/658))

### ❤️ Thank You

- Phillip Lovelace

## 3.15.2 (2026-02-02)

### Bug Fixes 🐛

- **pds-dropdown-menu-item:** add reflect option to target and external props ([#656](https://github.com/Kajabi/pine/pull/656))

### ❤️ Thank You

- Quinton Jason

## 3.15.1 (2026-01-30)

### Bug Fixes 🐛

- **pds-multiselect:** add csrf token support and fix selected items d… ([#654](https://github.com/Kajabi/pine/pull/654))

### Styles 🎨

- **pds-table-row:** update interactive token color ([#655](https://github.com/Kajabi/pine/pull/655))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.15.0 (2026-01-29)

### Features 🚀

- add external prop to dropdown menu ([#648](https://github.com/Kajabi/pine/pull/648))
- **pds-chip:** add remove url support ([#653](https://github.com/Kajabi/pine/pull/653))
- **pds-combobox:** add async to pds-combobox ([#651](https://github.com/Kajabi/pine/pull/651))
- **pds-multiselect:** add create tag functionality to pds-multiselect ([#652](https://github.com/Kajabi/pine/pull/652))

### Styles 🎨

- **pds-chip:** adjust padding values ([#645](https://github.com/Kajabi/pine/pull/645))
- **pds-table-cell:** update vertical align styles ([#650](https://github.com/Kajabi/pine/pull/650))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.14.2 (2026-01-27)

### Bug Fixes 🐛

- prevent crashes when components are double-initialized via CDN and React ([#647](https://github.com/Kajabi/pine/pull/647))

### ❤️ Thank You

- Phillip Lovelace

## 3.14.1 (2026-01-23)

### Bug Fixes 🐛

- rollback typescript-eslint to v6 with proper version compatibility ([#641](https://github.com/Kajabi/pine/pull/641))
- **pds-dropdown-menu:** prevent clipping in overflow containers ([#643](https://github.com/Kajabi/pine/pull/643))
- **pds-table:** improve sort indicator clarity ([#640](https://github.com/Kajabi/pine/pull/640))

### ❤️ Thank You

- Phillip Lovelace

## 3.14.0 (2026-01-15)

### Features 🚀

- **core:** Add keyboard and focus events to form components ([#636](https://github.com/Kajabi/pine/pull/636))
- **pds-avatar:** add initials props ([#635](https://github.com/Kajabi/pine/pull/635))

### Bug Fixes 🐛

- add ds token mapping ([#624](https://github.com/Kajabi/pine/pull/624))
- update release-info.json to remove template typo for version ([#631](https://github.com/Kajabi/pine/pull/631))
- upgrade typescript-eslint to v8 and stencil eslint plugin to v0.10 ([bdbde453](https://github.com/Kajabi/pine/commit/bdbde453))
- regenerate package-lock.json with --legacy-peer-deps to match CI ([ea4e0d91](https://github.com/Kajabi/pine/commit/ea4e0d91))
- update package-lock.json preserving v3.13.0 resolutions ([9df9d5f0](https://github.com/Kajabi/pine/commit/9df9d5f0))
- add --legacy-peer-deps to release job for consistency with build jobs ([c22a078b](https://github.com/Kajabi/pine/commit/c22a078b))
- **pds-table:** add default sorting props ([#633](https://github.com/Kajabi/pine/pull/633))

### Styles 🎨

- **pds-dropdown-menu-item:** adjust link styles for improved clickable area ([#630](https://github.com/Kajabi/pine/pull/630))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.13.0 (2026-01-12)

### Features 🚀

- **pds-table:** add head border, background, and row divider props ([#629](https://github.com/Kajabi/pine/pull/629))

### Bug Fixes 🐛

- **pds-tab:** add add disabled prop ([#626](https://github.com/Kajabi/pine/pull/626))

### Styles 🎨

- update alert dark mode link hover style ([#620](https://github.com/Kajabi/pine/pull/620))
- **form-inputs:** align error icon with top of multi-line messages ([#627](https://github.com/Kajabi/pine/pull/627))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.12.1 (2026-01-06)

### Bug Fixes 🐛

- bump token version and component adjustment to align with brand updates ([#622](https://github.com/Kajabi/pine/pull/622))
- **pds-modal:** make border prop mutable and remove debug logging ([#616](https://github.com/Kajabi/pine/pull/616))

### Styles 🎨

- **pds-copytext:** move background color to span element ([#623](https://github.com/Kajabi/pine/pull/623))
- **pds-input, pds-checkbox:** standardize helper and error message typography ([#617](https://github.com/Kajabi/pine/pull/617))

### ❤️ Thank You

- Phillip Lovelace

## 3.12.0 (2025-12-16)

### Features 🚀

- add custom data generator for autocomplete in vscode-html-language-server ([8140dfe8](https://github.com/Kajabi/pine/commit/8140dfe8))
- clean up code ([2fee3f3c](https://github.com/Kajabi/pine/commit/2fee3f3c))
- added vscode settings patcher as an install script ([c1b6386c](https://github.com/Kajabi/pine/commit/c1b6386c))

### Bug Fixes 🐛

- update semantic and core tokens in SCSS files ([#597](https://github.com/Kajabi/pine/pull/597))
- add semantic tokens ([#606](https://github.com/Kajabi/pine/pull/606))
- update to kajabi-ui styles to 1.0.3 ([#610](https://github.com/Kajabi/pine/pull/610))
- update box spacing values ([#611](https://github.com/Kajabi/pine/pull/611))
- **core:** export component types for TypeScript resolution ([#592](https://github.com/Kajabi/pine/pull/592))
- **pds-alert:** update padding of alert to 20px ([#602](https://github.com/Kajabi/pine/pull/602))
- **pds-divider, pds-link, pds-progress:** update code connect properties and examples ([#595](https://github.com/Kajabi/pine/pull/595))
- **release:** update Slack notification workflow to use environment var ([#593](https://github.com/Kajabi/pine/pull/593))
- **storybook:** update Vite watch config for HMR live reload ([#603](https://github.com/Kajabi/pine/pull/603))
- **storybook:** use pine-core ESM bundle to fix HMR reload errors ([#605](https://github.com/Kajabi/pine/pull/605))

### Documentation 📄

- standardize docs sections and add form integration section to form components ([#594](https://github.com/Kajabi/pine/pull/594))
- **pds-icon:** add technical notes on icon usage differences between React and web components ([#596](https://github.com/Kajabi/pine/pull/596))
- **storybook:** update changelog page with actual list from changelog.md ([#604](https://github.com/Kajabi/pine/pull/604))

### Styles 🎨

- address transform minification warnings ([#612](https://github.com/Kajabi/pine/pull/612))
- **pds-button:** adjust tertiary hover styles ([#613](https://github.com/Kajabi/pine/pull/613))

### ❤️ Thank You

- Jeremy Saenz @codegangsta
- Phillip Lovelace
- Quinton Jason

## 3.11.1 (2025-11-19)

### Bug Fixes 🐛

- update code connect mappings to match latest component updates ([#581](https://github.com/Kajabi/pine/pull/581))
- **deps:** update glob from 10.3.10 to 11.1.0 to resolve security vulnerability ([#590](https://github.com/Kajabi/pine/pull/590))
- **input-interface:** correct typo in event detail property name ([#587](https://github.com/Kajabi/pine/pull/587))

### Documentation 📄

- Improve docs navigation & support resources ([#585](https://github.com/Kajabi/pine/pull/585))
- add intro image to welcome page ([#586](https://github.com/Kajabi/pine/pull/586))
- **pds-alert, pds-toast:** improve DocCanvas formatting for readability ([#591](https://github.com/Kajabi/pine/pull/591))

### ❤️ Thank You

- Phillip Lovelace

## 3.11.0 (2025-11-12)

### Bug Fixes 🐛

- **deps:** update @pine-ds/icons to 9.12.0 with Stencil 4.38.3 ([#580](https://github.com/Kajabi/pine/pull/580))

### ❤️ Thank You

- Phillip Lovelace

## 3.10.0 (2025-11-12)

### Features 🚀

- **pds-button:** add tertiary variant and sizing prop ([#575](https://github.com/Kajabi/pine/pull/575))

### Bug Fixes 🐛

- **pds-popover:** convert to slot for trigger and portal rendering ([#574](https://github.com/Kajabi/pine/pull/574))

### ❤️ Thank You

- Phillip Lovelace

## 3.9.0 (2025-10-30)

### Features 🚀

- **pds-input:** add highlight prop and styling ([#567](https://github.com/Kajabi/pine/pull/567))
- **pds-select:** add highlight prop and styling ([#568](https://github.com/Kajabi/pine/pull/568))
- **pds-textarea:** add highlight prop and styling ([#569](https://github.com/Kajabi/pine/pull/569))

### Bug Fixes 🐛

- **pds-accordion:** add accordion-icon part for styling ([#572](https://github.com/Kajabi/pine/pull/572))

### Documentation 📄

- add changelogs to storybook documentation ([#571](https://github.com/Kajabi/pine/pull/571))
- add highlight prop to figma code connect files ([#573](https://github.com/Kajabi/pine/pull/573))

### ❤️ Thank You

- Phillip Lovelace

## 3.8.2 (2025-10-24)

### Bug Fixes 🐛

- **pds-box:** add core tokens to spacing set ([#565](https://github.com/Kajabi/pine/pull/565))
- **pds-radio:** add contained variant and image slot ([#562](https://github.com/Kajabi/pine/pull/562))

### Documentation 📄

- **pds-row:** add modifiers to size prop in examples ([#566](https://github.com/Kajabi/pine/pull/566))

### Styles 🎨

- **pds-progress:** update progress bar styles and add gradient fill color documentation ([#564](https://github.com/Kajabi/pine/pull/564))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.8.1 (2025-10-21)

### Documentation 📄

- display pine version in storybook ([#561](https://github.com/Kajabi/pine/pull/561))

### Styles 🎨

- **pds-tab:** remove z-index from pill variant ([#563](https://github.com/Kajabi/pine/pull/563))

### ❤️ Thank You

- Phillip Lovelace

## 3.8.0 (2025-10-15)

### Features 🚀

- implements z-index values across components using new tokens ([#549](https://github.com/Kajabi/pine/pull/549))
- add readonly type property to form components ([#559](https://github.com/Kajabi/pine/pull/559))
- **pds-popover:** implement methods control and events ([#548](https://github.com/Kajabi/pine/pull/548))

### Bug Fixes 🐛

- **pds-combobox:** add chip trigger variant ([#550](https://github.com/Kajabi/pine/pull/550))
- **pds-combobox:** update highlighted option logic when selected ([#554](https://github.com/Kajabi/pine/pull/554))
- **pds-combobox:** add attachInternals and add to form docs ([#556](https://github.com/Kajabi/pine/pull/556))
- **pds-combobox:** update docs and space key functionality ([#560](https://github.com/Kajabi/pine/pull/560))
- **pds-copytext:** update button padding and class name syntax in stories ([#546](https://github.com/Kajabi/pine/pull/546))
- **pds-tabs:** correct keyboard navigation for tabs when panels have focusable elements ([#555](https://github.com/Kajabi/pine/pull/555))

### Styles 🎨

- **pds-input:** correct styles for append/prepend button height ([#551](https://github.com/Kajabi/pine/pull/551))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.7.0 (2025-10-02)

### Features 🚀

- **pds-filters:** adds pds-filter and pds-filters to system ([#536](https://github.com/Kajabi/pine/pull/536))

### Bug Fixes 🐛

- add combobox option group labels ([#535](https://github.com/Kajabi/pine/pull/535))
- **docs:** correct typos and improve consistency in docs across multiple components ([#544](https://github.com/Kajabi/pine/pull/544))
- **pds-button:** add 'filter' variant with specific styles and icon ([#538](https://github.com/Kajabi/pine/pull/538))
- **pds-combobox:** add enlarge icon to input trigger ([#540](https://github.com/Kajabi/pine/pull/540))
- **pds-combobox:** update keyboard button trigger open close functionality ([#541](https://github.com/Kajabi/pine/pull/541))
- **pds-tab:** remove browser default focus ring ([#537](https://github.com/Kajabi/pine/pull/537))
- **pds-tabs:** add shadow parts for tab components ([#534](https://github.com/Kajabi/pine/pull/534))

### Styles 🎨

- **pds-dropdown-menu-separator:** update separator styles for improved appearance ([#543](https://github.com/Kajabi/pine/pull/543))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.6.0 (2025-09-19)

### Features 🚀

- **pds-textarea:** add max-length character counter ([#529](https://github.com/Kajabi/pine/pull/529))

### Bug Fixes 🐛

- **pds-box:** add responsive modifiers to box model and layout props ([#531](https://github.com/Kajabi/pine/pull/531))
- **pds-button:** add enter key handling for form submissions ([#532](https://github.com/Kajabi/pine/pull/532))
- **pds-modal:** add scrollable boolean and resolve dynamic border positioning ([#528](https://github.com/Kajabi/pine/pull/528))
- **pds-modal:** add dvh unit to heights ([#533](https://github.com/Kajabi/pine/pull/533))

### Styles 🎨

- **pds-modal:** fix max height for fullscreen modals ([#530](https://github.com/Kajabi/pine/pull/530))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.5.2 (2025-09-12)

### Bug Fixes 🐛

- **pds-box:** add responsive modifier to flex properties ([#527](https://github.com/Kajabi/pine/pull/527))

### ❤️ Thank You

- Quinton Jason

## 3.5.1 (2025-09-09)

### Bug Fixes 🐛

- **pds-table:** add shadow parts for improved styling ([#525](https://github.com/Kajabi/pine/pull/525))

### ❤️ Thank You

- Phillip Lovelace

## 3.5.0 (2025-09-05)

### Features 🚀

- add code connect ([#468](https://github.com/Kajabi/pine/pull/468))
- **pds-table:** add alignment for cell and head cells in component ([#517](https://github.com/Kajabi/pine/pull/517))

### Bug Fixes 🐛

- **pds-box:** add wrap prop and tests ([#521](https://github.com/Kajabi/pine/pull/521))
- **pds-input, pds-textarea:** adds hide-label prop to visually hide label text ([#519](https://github.com/Kajabi/pine/pull/519))
- **pds-table:** case-insensitive sorting for the table component ([#516](https://github.com/Kajabi/pine/pull/516))
- **pds-table:** refactor expanding width and scrolling for responsive table ([#523](https://github.com/Kajabi/pine/pull/523))
- **pds-tooltip:** add floating UI for placement and smart positioning ([#520](https://github.com/Kajabi/pine/pull/520))

### Styles 🎨

- **pds-tab:** update background colors and hover states for filter tabs ([#518](https://github.com/Kajabi/pine/pull/518))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.4.3 (2025-08-19)

### Bug Fixes 🐛

- **pds-button:** add button link to full width rule ([#513](https://github.com/Kajabi/pine/pull/513))

### Documentation 📄

- update row examples and box docs ([#510](https://github.com/Kajabi/pine/pull/510))
- update story boolean attribute handling across components ([#514](https://github.com/Kajabi/pine/pull/514))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.4.2 (2025-08-12)

### Bug Fixes 🐛

- Unify color token handling across components (backward compatible) ([#506](https://github.com/Kajabi/pine/pull/506))
- add form association and element internals to checkbox and switch ([#508](https://github.com/Kajabi/pine/pull/508))
- **pds-box:** add custom flex values to flex prop ([#509](https://github.com/Kajabi/pine/pull/509))

### ❤️ Thank You

- Quinton Jason

## 3.4.1 (2025-08-07)

### Bug Fixes 🐛

- **form elements:** add form association and element internals ([#500](https://github.com/Kajabi/pine/pull/500))
- **form-elements:** align height spacing and message color ([#488](https://github.com/Kajabi/pine/pull/488))
- **pds-button:** add white space nowrap to button text ([#490](https://github.com/Kajabi/pine/pull/490))
- **pds-input:** add full width variant  tests and docs ([#489](https://github.com/Kajabi/pine/pull/489))
- **pds-input:** update select prepend and append height ([#496](https://github.com/Kajabi/pine/pull/496))
- **pds-modal:** adjust max height ot remove double scrollbars ([#503](https://github.com/Kajabi/pine/pull/503))

### Documentation 📄

- remove camel case from documentation ([#504](https://github.com/Kajabi/pine/pull/504))
- **icon:** Update for more detailed usage and troubleshooting guidelines ([#495](https://github.com/Kajabi/pine/pull/495))

### Styles 🎨

- **pds-box:** update md border radius ([#502](https://github.com/Kajabi/pine/pull/502))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.4.0 (2025-07-17)

### Features 🚀

- action slot for pds-input, pds-select, & pds-textarea ([#485](https://github.com/Kajabi/pine/pull/485))
- **combobox:** add combobox ([#476](https://github.com/Kajabi/pine/pull/476))
- **pds-property:** add property component to system ([#479](https://github.com/Kajabi/pine/pull/479))
- **pds-text:** add CSS part support to component ([#481](https://github.com/Kajabi/pine/pull/481))
- **typography:** standardize form label typography ([#480](https://github.com/Kajabi/pine/pull/480))

### Bug Fixes 🐛

- resolve Sass deprecation warnings ([#482](https://github.com/Kajabi/pine/pull/482))

### Documentation 📄

- **pds-input:** update story implementations to use args for dynamic properties ([#487](https://github.com/Kajabi/pine/pull/487))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.3.0 (2025-06-27)

### Features 🚀

- **pds-chip:** adds brand sentiment and icon prop ([#467](https://github.com/Kajabi/pine/pull/467))
- **pds-tooltip:** implement pathname change detection for SPA navigation ([#473](https://github.com/Kajabi/pine/pull/473))

### Bug Fixes 🐛

- add input props ([#472](https://github.com/Kajabi/pine/pull/472))
- **input:** add prefix, suffix, prepend, and append ([#428](https://github.com/Kajabi/pine/pull/428))

### Documentation 📄

- add hide label to select slotted elements ([#470](https://github.com/Kajabi/pine/pull/470))

### ❤️ Thank You

- Phillip Lovelace
- Quinton Jason

## 3.2.0 (2025-06-06)

### Features 🚀

- **link:** adds color prop ([#458](https://github.com/Kajabi/pine/pull/458))
- **pds-alert:** new alert component ([#452](https://github.com/Kajabi/pine/pull/452))
- **pds-dropdown:** implementation ([#455](https://github.com/Kajabi/pine/pull/455))
- **pds-toast:** add pds-toast component ([#462](https://github.com/Kajabi/pine/pull/462))

### Bug Fixes 🐛

- correct CSS variable naming in pds-box minWidth property ([#466](https://github.com/Kajabi/pine/pull/466))
- **chip:** updates a11y docs ([#449](https://github.com/Kajabi/pine/pull/449))
- **pds-alert:** remove description prop and use slot ([#463](https://github.com/Kajabi/pine/pull/463))
- **pds-chip:** correct React syntax in documentation examples ([#465](https://github.com/Kajabi/pine/pull/465))
- **pds-modal:** update closeonbackdropclick prop and auto generated file ([#461](https://github.com/Kajabi/pine/pull/461))
- **pds-popover:** adds missing -start and -end positioning ([#454](https://github.com/Kajabi/pine/pull/454))

### Documentation 📄

- **pds-box:** improve responsive size prop documentation [DSS-1405] ([#459](https://github.com/Kajabi/pine/pull/459))
- **pds-text:** fix invalid color token in example ([#464](https://github.com/Kajabi/pine/pull/464))

### ❤️ Thank You

- Ashley E
- Julian Skinner @ju-Skinner
- Phillip Lovelace
- Quinton Jason

## 3.1.0 (2025-05-09)

### Features 🚀

- **pds-icon:** add additional props for react pds icon ([#443](https://github.com/Kajabi/pine/pull/443))

### Bug Fixes 🐛

- **checkbox:** fixes checkbox not using error message for aria-describedby attribute ([#439](https://github.com/Kajabi/pine/pull/439))
- **switch:** fixes component not using error message for aria-describedby attribute ([#441](https://github.com/Kajabi/pine/pull/441))

### Documentation 📄

- **accordion:** adds description for accessibility ([#446](https://github.com/Kajabi/pine/pull/446))
- **button:** rewrites some accessibility info ([#447](https://github.com/Kajabi/pine/pull/447))
- **popover:** using template literals needed to include unsafeHTML from lit ([#438](https://github.com/Kajabi/pine/pull/438))

### Styles 🎨

- update text alignment styles to logical ([#448](https://github.com/Kajabi/pine/pull/448))
- **pds-link:** add hover style to remove text decoration ([#444](https://github.com/Kajabi/pine/pull/444))

### ❤️ Thank You

- Ashley E
- Julian Skinner @ju-Skinner
- Phillip Lovelace

## 3.0.3 (2025-04-29)

This was a version bump only, there were no code changes.

## 3.0.2 (2025-04-29)

This was a version bump only, there were no code changes.

## 3.0.1 (2025-04-25)

### Bug Fixes 🐛

- add logical properties ([#427](https://github.com/Kajabi/pine/pull/427))

### Styles 🎨

- update Divider styles ([#432](https://github.com/Kajabi/pine/pull/432))
- remove token studio ([#434](https://github.com/Kajabi/pine/pull/434))
- **tokens:** extended colors ([#425](https://github.com/Kajabi/pine/pull/425))
- **typography:** adds Noto font family for language support ([#433](https://github.com/Kajabi/pine/pull/433))

### ❤️ Thank You

- Ashley E
- Julian Skinner @ju-Skinner
- Phillip Lovelace
- Quinton Jason

# 3.0.0 (2025-04-11)

### Features 🚀

- **text:** expands text color prop ([#426](https://github.com/Kajabi/pine/pull/426))

### Bug Fixes 🐛

- **box:** directional margin and direction padding props ([#412](https://github.com/Kajabi/pine/pull/412))
- **checkbox:** update prop name from label hidden to hide label ([#418](https://github.com/Kajabi/pine/pull/418))
- ⚠️  **chip:** move value to slot ([#364](https://github.com/Kajabi/pine/pull/364))
- **radio:** add hide label prop ([#414](https://github.com/Kajabi/pine/pull/414))
- **switch:** add hide label prop ([#417](https://github.com/Kajabi/pine/pull/417))

### Styles 🎨

- updates component focus rings ([#413](https://github.com/Kajabi/pine/pull/413))
- **checkbox:** resolve error message icon alignment and shrink ([#422](https://github.com/Kajabi/pine/pull/422))
- **radio:** resolve error message icon alignment ([#423](https://github.com/Kajabi/pine/pull/423))
- **switch:** resolve error message icon alignment and parent overflow ([#424](https://github.com/Kajabi/pine/pull/424))

### ⚠️  Breaking Changes

- ⚠️  **chip:** move value to slot ([#364](https://github.com/Kajabi/pine/pull/364))

### ❤️ Thank You

- Ashley E
- Quinton Jason

## 2.17.0 (2025-03-31)

### Features 🚀

- adds more font size values and adds italics and truncate to docs table ([#403](https://github.com/Kajabi/pine/pull/403))

### Bug Fixes 🐛

- fixes icon alignment ([#405](https://github.com/Kajabi/pine/pull/405))
- copy text hover and truncate adjustments ([#406](https://github.com/Kajabi/pine/pull/406))
- add padding-block  padding-inline properties and align-self ([#399](https://github.com/Kajabi/pine/pull/399))
- **button:** add disabled styles to host ([#411](https://github.com/Kajabi/pine/pull/411))
- **checkbox:** label-hidden prop is not hiding label text ([#407](https://github.com/Kajabi/pine/pull/407))
- **pds-copytext:** correct full-width and truncated styles, update docs ([#410](https://github.com/Kajabi/pine/pull/410))

### Documentation 📄

- adds semantic token pages and fixes token table styling ([#400](https://github.com/Kajabi/pine/pull/400))

### Styles 🎨

- re-adds responsive image styling ([#404](https://github.com/Kajabi/pine/pull/404))

### ❤️ Thank You

- Ashley E
- Phillip Lovelace
- Quinton Jason

## 2.16.4 (2025-03-17)

### Bug Fixes 🐛

- **radio:** add inner shadow wrapper ([#385](https://github.com/Kajabi/pine/pull/385))

### Styles 🎨

- update pill tabs styles ([#390](https://github.com/Kajabi/pine/pull/390))
- update box min height and border radius ([#389](https://github.com/Kajabi/pine/pull/389))
- add 125 token ([#387](https://github.com/Kajabi/pine/pull/387))
- changes from token studio after exporting styles ([ec2a67a1](https://github.com/Kajabi/pine/commit/ec2a67a1))
- add conditional label for input and select ([#391](https://github.com/Kajabi/pine/pull/391))
- add background color to form inputs ([#401](https://github.com/Kajabi/pine/pull/401))
- **button:** adjust flex to fix layout ([#396](https://github.com/Kajabi/pine/pull/396))
- **button:** update primary disabled color to be grey-150 ([#397](https://github.com/Kajabi/pine/pull/397))
- **checkbox:** resolve wrapping issue ([#384](https://github.com/Kajabi/pine/pull/384))
- **tokens:** add new styles for heading caption and body monospace ([#395](https://github.com/Kajabi/pine/pull/395))

### ❤️ Thank You

- Julian Skinner @ju-Skinner
- Kajabi Automations Bot @dev-kjbot
- Phillip Lovelace
- Quinton Jason

## 2.16.3 (2025-02-28)

### Bug Fixes 🐛

- update input invalid state styles ([#377](https://github.com/Kajabi/pine/pull/377))
- removes unneeded label margin ([#383](https://github.com/Kajabi/pine/pull/383))
- **button:** full width and loading state ([#380](https://github.com/Kajabi/pine/pull/380))

### Styles 🎨

- adds background color to secondary and disclosure buttons ([#379](https://github.com/Kajabi/pine/pull/379))
- **box:** update classes to use correct dimension tokens ([#388](https://github.com/Kajabi/pine/pull/388))

### ❤️ Thank You

- Ashley E
- Julian Skinner @ju-Skinner
- Phillip Lovelace
- Quinton Jason

## 2.16.2 (2025-02-24)

### Bug Fixes 🐛

- **switch:** add margin inline start value ([#376](https://github.com/Kajabi/pine/pull/376))

### Styles 🎨

- adds proper font styles to form elements ([#375](https://github.com/Kajabi/pine/pull/375))
- **accordion:** adjust summary colors ([#374](https://github.com/Kajabi/pine/pull/374))

### ❤️  Thank You

- Ashley E
- Phillip Lovelace
- Quinton Jason

## 2.16.1 (2025-02-21)

### Bug Fixes 🐛

- remove box min height ([#373](https://github.com/Kajabi/pine/pull/373))
- add pill variant ([#368](https://github.com/Kajabi/pine/pull/368))

### Styles 🎨

- add pointer cursor ([#363](https://github.com/Kajabi/pine/pull/363))
- **accordion:** fix misspelling for summary padding ([#372](https://github.com/Kajabi/pine/pull/372))

### ❤️  Thank You

- Julian Skinner @ju-Skinner
- Quinton Jason

## 2.16.0 (2025-02-19)

### Features 🚀

- **docTokenTale:** update to handle dimension tokens ([#371](https://github.com/Kajabi/pine/pull/371))

### ❤️  Thank You

- Julian Skinner @ju-Skinner

## 2.15.0 (2025-02-19)

### Features 🚀

- add additional events, pdsBlur, pdsInput, pdsChange to input and textarea ([#370](https://github.com/Kajabi/pine/pull/370))

### Bug Fixes 🐛

- tooltip visibility issue on ios safari back navigation ([#369](https://github.com/Kajabi/pine/pull/369))

### Styles 🎨

- fixes incorrect token for box padding-xs ([#365](https://github.com/Kajabi/pine/pull/365))
- adjust background color values for secondary and disclosure ([#366](https://github.com/Kajabi/pine/pull/366))
- **tokens:** new token sets for core, semantic, and branding ([#318](https://github.com/Kajabi/pine/pull/318))

### ❤️  Thank You

- Ashley E
- Julian Skinner @ju-Skinner
- Phillip Lovelace

## 2.14.0 (2025-02-03)

### Features 🚀

- **pds-text:** decoration prop for pds text ([#362](https://github.com/Kajabi/pine/pull/362))

### ❤️  Thank You

- Phillip Lovelace