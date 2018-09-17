# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [0.5.1] - 2018-09-17

### Changed
- Improve CHANGELOG file format.
- `Plugins.ProgressiveImage` 
  - Plugin now uses component classes (`.c-progressiveImage`) instead of object classes.

### Fixed
- Links in README file now point to the right URLs.
- Do not let `Sushi.init()` try to init elements that can't have children.
- Clear the contents of modals after they close if the content was put there when they opened.


## [0.5.0] - 2018-09-05

### Breaking changes
#### `Plugins.Modal`
- `.c-modals` (aka `mainContainer`) functionality has been removed. Now every modal has its own
  container, which by default is appended to the `<body>`.
 
##### JavaScript
- `mainContainer` option has been removed.
- `overlayExtraClasses` option has been removed.
- `appendTo` option has been added and points to an arbitrary element on the page which will contain
  the modal element. Defaults to `document.body`.
- `container` option is now called `contentContainer`.
- `Modal.first.open` and `Modal.last.close` event triggers have been removed. If you need info on 
  the current state (and number) of open modals, get the value of `Sushi.Plugins.Modal.openModals`.

##### CSS
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
#### `Plugins.Chaser`
- Fixed placeholder height setter not setting any height.

#### `Plugins.ScrollTrigger`
- Fixed offset parameter not working when `triggerPosition` was set to `bottom`.


[Unreleased version]: https://github.com/dogandpony/sushi-bazooka/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/dogandpony/sushi-bazooka/compare/v0.4.7...v0.5.0
[0.4.7]: https://github.com/dogandpony/sushi-bazooka/compare/v0.4.6...v0.4.7
