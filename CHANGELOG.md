# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project will adhere to [Semantic Versioning](http://semver.org/spec/v2.0.0.html) once it's
out of beta. Currently we treat `0.x.y` where `x` is **major** and `y` can be either **minor** or
**patch** versions. This way we keep code from spilling to real major versions.


## [Unreleased Version]

### Fixed
- **Events**: `Events.off()` had a long-running issue that made it remove all events under a given 
  namespace if there were other events whose names ended with the same string. For instance, if a 
  `foobar.scroll` event was registered and `removeListeners()` was called to remove `bar.scroll` 
  events, `foobar.scroll` would also be removed even it not being supposed to.
  
### Changed
- **Plugins.ProgressiveImage**: Reverted change that set the container's display as `inline-block`.
- **Plugins.Select**
  - Renamed `updateOptions` method to `updateItems`.
  - Renamed `createContainer` method to `create`.
  - Renamed `dropdownOptions` property to `dropdownItems`.
  - Now the dropdown class is not applied to the list anymore. The list has its own class,
    `c-select__list`. Sub-lists created from optgroups use the same class and also have the `group`
    modifier. The `c-select__dropdown` class is applied to the dropdown container, which now also
    contains the newly implemented search field.

### Removed

### Added
- New plugin: **Excerpt**. This plugin will truncate a text node to the maximum number of words that
  fit in a specific number of lines. The number of lines are configured via `lines` option.
- Added documentation to all functions in `Sushi.Util`.
- Added `Util.escapeRegExp()` function to escape strings for RegExp objects.
- **Plugins.ProgressiveImage**: Add a `responsive` option. If true, what it defaults to, and if
  `setWidth` is also true, it adds a `responsive` modifier which then sets `max-width: 100%` to the
   container.
- **Plugins.Select**
  - Support for `<optgroup>`s.
  - Search feature.
- Added polyfill for `String.prototype.includes`.


## [0.6.2] - 2018-10-18

### Changed
- **Plugins.ProgressiveImage**: Change container display style to `inline-block`.

### Added
- **Plugins.ProgressiveImage**: Add option to set container width based on the image's width,
  defaulting to true.


## [0.6.1] - 2018-10-16

### Fixed
- **Plugins.ScrollTrigger**: 
  - Element position is now checked when the plugin inits, and not only when the scroll event is 
    fired.
  - Make sure `disable()` only disables the current instance instead of all instances.

### Changed
- **Plugins.ScrollTrigger**: Changes the event functions argument list to only one argument: the
  current plugin instance. 

### Added
- **Plugins.ProgressiveImage**: Added `lazyload` option to load original images only when the 
  browser scroll has hit their container.


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


[Unreleased version]: https://github.com/dogandpony/sushi-bazooka/compare/v0.6.2...HEAD
[0.6.2]: https://github.com/dogandpony/sushi-bazooka/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/dogandpony/sushi-bazooka/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/dogandpony/sushi-bazooka/compare/v0.5.3...v0.6.0
[0.5.3]: https://github.com/dogandpony/sushi-bazooka/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/dogandpony/sushi-bazooka/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/dogandpony/sushi-bazooka/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/dogandpony/sushi-bazooka/compare/v0.4.7...v0.5.0
[0.4.7]: https://github.com/dogandpony/sushi-bazooka/compare/v0.4.6...v0.4.7
[0.4.6]: https://github.com/dogandpony/sushi-bazooka/compare/v0.4.5...v0.4.6
[0.4.5]: https://github.com/dogandpony/sushi-bazooka/compare/v0.4.4...v0.4.5
