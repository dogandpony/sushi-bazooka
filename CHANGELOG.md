# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2018-10-11

### Fixed
- **Dom**
  - Re-added `Dom.append()` and `Dom.clone()`.
  - Fixed `Dom.append()` failing to append all elements if they come from a document fragment.
  - Fixed "single selector" conditional when valid class selectors where passed straight to 
- **Plugins.Modal**: fixed `copy` and `move` content operations, which would sometimes break 
  depending on the type of data passed to the `content` option.

### Changed
- **Plugins.Modal**
  - `modal`, `overlay` and `contentContainer` options have been replaced with the option `template`.
  - `modal` property has been renamed to `element`.
  - Increased modal content padding.
  - Set modal with to 800px.

### Removed
- **Plugins.Modal**
  - Extended event triggers like `Modal.open` and `Modal.close`.
  - Removed unused `size` parameter.
  - Removed `calculatedCentering` option. Only flexbox-based centering is supported from now on.

### Added
- **Plugins.Modal**: Added feature to use a pre-rendered modal template.
- Added `ChildNode.remove()` polyfill.


## [0.5.3] - 2018-09-26

### Fixed
- `Sushi.Dom.addClass()` failing if class string had tabs and/or line breaks.
- **Plugins.ProgressiveImage**: Prevent flash of unstyled content while image is loading.


## [0.5.2] - 2018-09-20

### Added
- Mutation Observer helper.


## [0.5.1] - 2018-09-17

### Fixed
- Links in README file now point to the right URLs.
- Do not let `Sushi.init()` try to init elements that can't have children.
- Clear the contents of modals after they close if the content was put there when they opened.

### Changed
- Improve CHANGELOG file format.
- **Plugins.ProgressiveImage**: Plugin now uses component classes (`.c-progressiveImage`) instead of 
  object classes.


## [0.5.0] - 2018-09-05

### Breaking changes
- **Plugins.Modal**
  - `.c-modals` (aka `mainContainer`) functionality has been removed. Now every modal has its own
    container, which by default is appended to the `<body>`.
  - **JavaScript**
    - `mainContainer` option has been removed.
    - `overlayExtraClasses` option has been removed.
    - `appendTo` option has been added and points to an arbitrary element on the page which will 
      contain the modal element. Defaults to `document.body`.
    - `container` option is now called `contentContainer`.
    - `Modal.first.open` and `Modal.last.close` event triggers have been removed. If you need info 
      on the current state (and number) of open modals, get the value of 
      `Sushi.Plugins.Modal.openModals`.
  - **CSS**
    - `c-modals` class has been removed.
    - `c-modal` class is now used in the modal container, rather than `c-modals`.
    - `c-modalOverlay` was renamed to `c-modal__overlay`.
    - `c-modalContainer` was renamed to `c-modal__content`.
    - `is-open` class is now only added to the `.c-modal` container.

### Added
- Changelog file.
- Progressive Images plugin.
- `Dom.each()` function to make it easier to implement repeating code across HTML Element lists.

### Changed
- Changed No JS class from `noJs` to `no-js`.


## [0.4.7] - 2018-08-31

### Fixed
- **Plugins.Chaser**: Fixed placeholder height setter not setting any height.
- **Plugins.ScrollTrigger**: Fixed offset parameter not working when `triggerPosition` was set to 
  `bottom`.


## [0.4.6] - 2018-08-24

### Fixed
- Fix undefined variable in the Actions controller parsing method.
- Actions controller parsing does not depend on the loading order of the scripts anymore.
- Fix "double-padding" issue in `width()` and `height()` in `Util.Css`.

### Changed
- Chaser now uses object classes instead of component classes.
- Improved ScrollTrigger event handling by using Actions library methods.
- ScrollTrigger's `events.before`, `events.while` and `events.after` options to `eventBefore`,
  `eventWhile` and `eventAfter`, respectively.
- Rename Actions' `parseControllers()` to `parseController()` and make it public.

### Added
- Chaser z-index variable setting.


## [0.4.5] - 2018-08-21

### Fixed
- **BodyScroll**
  - Fix class names generated in the custom style tag.
  - Remove dependency of specific script load order.

### Added
- **Plugins.Modal**: Check if BodyScroll library exists and warn user if it doesn't.


[Unreleased version]: https://github.com/dogandpony/sushi-bazooka/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/dogandpony/sushi-bazooka/compare/v0.5.3...v0.6.0
[0.5.3]: https://github.com/dogandpony/sushi-bazooka/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/dogandpony/sushi-bazooka/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/dogandpony/sushi-bazooka/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/dogandpony/sushi-bazooka/compare/v0.4.7...v0.5.0
[0.4.7]: https://github.com/dogandpony/sushi-bazooka/compare/v0.4.6...v0.4.7
[0.4.6]: https://github.com/dogandpony/sushi-bazooka/compare/v0.4.5...v0.4.6
[0.4.5]: https://github.com/dogandpony/sushi-bazooka/compare/v0.4.4...v0.4.5
