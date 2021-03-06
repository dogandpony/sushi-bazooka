# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project will adhere to [Semantic Versioning](http://semver.org/spec/v2.0.0.html) once it's out of beta. Currently we work with `0.x.y` where `x` is **major** and `y` can be either **minor** or **patch** versions. This way we keep code from spilling to real major versions.


## [0.20.1] - 2020-07-13

## Fixed
- **Polyfills**: Add `configurable` option to `Array.includes` and `String.includes` polyfills so they don't break when other libs try to overwrite them. 


## [0.20.0] - 2020-04-16

## Fixed
- **Dom.forEach()**: This method now properly handles NodeList and HTMLCollection objects without breaking or skipping items. 


## [0.19.0] - 2020-03-02

## Changed
- **Plugins.Tooltip**: The plugin may now be used on inline elements as well.

## Fixed
- **Plugins.Chaser**, **Util.Css**: Changed `scrollY` and `scrollX` to `pageYOffset` and `pageXOffset` to add compatibility with IE11.


## [0.18.2] - 2020-02-05

## Added
- **Plugins.BasePlugin**: Add base event data (with instance reference) to `beforecreate` and `aftercreate` triggers.


## [0.18.1] - 2020-02-04

## Fixed
- **Plugins.BasePlugin**: Fixed `beforecreate` and `aftercreate` triggers.


## [0.18.0] - 2020-02-03

## Fixed
- **Dom**: Fixed `append()` skipping odd-number items.

## Added
- **Plugins.Modal**, **Plugins.ProgressiveImage**, **Plugins.Select**, **Plugins.Tooltip**: Added `beforecreate` and `aftercreate` events to all plugins that create their own markup.


## [0.17.2] - 2020-01-07

### Changed
- **Sushi.getPluginInstance()**: Now the first parameter can also be a string that matches a plugin's _displayName_.
- **All plugins**: Now all data-attributes don't need to be prefixed with the plugin's name, as such: `data-modal-target` may be replaced with `data-target`.

## Fixed
- **Plugins.Reveal**: Plugin instances are now opening and closing again. This was a bug introduced on [0.17.1] that made the instances not aware of their own initial states, making the plugin non operational.

## Added
- **Plugins.Reveal**: Added `Reveal.opened` and `Reveal.closed` triggers when the open and close transitions have been finished, respectively.


## [0.17.1] - 2019-12-19

### Changed
- **Plugins.Reveal**
  - The class `c-reveal--hidden` is not necessary anymore.
  - Option `animateDimensions` was added to set if the plugin should animate the container's `"height"`, `"width"` or `"both"`. This option is case-insensitive.
  - It is not necessary to use the class `c-reveal__content` in the content element anymore, but that will prevent the content itself from animating even if classes like `c-reveal--appearFromBottom` or `c-reveal--fade` are used.

## Fixed
- **Util.Css.getMaxTransitionDuration()**: The function description now describes the second argument as optional.

## Added
- **Plugins.Video**: Added option `hideOnPause` to, well, hide the video player whenever it's paused.


## [0.17.0] - 2019-08-21

### Changed
- **Actions**: Action controllers are only parsed when events are triggered, enabling functions to be declared at any point in the DOM rendering process.

### Fixed
- **Plugins.Tooltip**: Tooltips don't take any screen space while they are closed anymore.

### Added
- **Plugins.Tooltip**: Tooltips now auto-centralize when the page is resized.


## [0.16.2] - 2019-08-02

### Changed
- **Plugins.Chaser**: Improved calculations for limit point and limited position.

### Fixed
- **Plugins.ProgressiveImages**: Fixed lazy load not triggering or triggering too late.


## [0.16.1] - 2019-07-29

### Fixed
- **Dom**: Fixed query methods not being able to target multi-class or multi-id selectors.
- **Plugins.Select**
  - Fixed issue on which pressing spacebar after closing the select would open it again and no text could be typed in any inputs in the page.
  - Fixed arrow up/down selecting hidden elements in the select.
  - Return focus to the button when select is closed.
  - Made sure to add key event listeners when the button is focused or clicked.


## [0.16.0] - 2019-07-17

### Changed
- **Plugins.Modal**: Removed deprecated options: `horizontalCentering` and `verticalCentering`.
- **Plugins.ScrollTrigger**: Pass the plugin instance as a parameter of the offset function.

### Fixed
- **Plugins.Modal**: Fixed close button padding in iOS devices.

### Added
- **Dom**: Added `Dom.forEach()` and deprecated `Dom.each()`. This new function passes the element and the element index to the callback function, just like `Array.forEach()` does.
- **Plugins.Chaser**: Added option to invert the functionality of the plugin, effectively pulling up a container until the scrolling of the page reaches its initial position — versus the default behavior, that pushes down a container, away from its original position.


## [0.15.0] - 2019-07-05

### Breaking Changes
This version is the first one in a series of breaking releases that will change the way events are handled in Sushi Bazooka. In this first one, event triggers were changed to namespace event types. This decision was made to fix tons of event-related issues that were generated by clashing event types (such as `open` and `close` events, that were triggered by multiple plugins). From now on, listening to global events (again, such as `open` and `close`) will not capture any triggers since they were all changed to use namespace events (such as `Modal.open` and `Select.close`). If you still need to listen to global events, a new notation was created for that: `*.open` will capture all events under the `open` namespace (such as `Modal.open` or `Select.open`). That's specially useful for an oncoming change on the `contentchange` event. 

### Fixed
- Fixed a lot of event-related issues by changing all event types in plugin triggers to namespaced events.
- **Dom**: `Dom.query()` and `Dom.queryAll()` now send attribute selectors to the native `querySelector()` method.


## [0.14.2] - 2019-07-01

### Fixed
- **Plugins.Modal**: Fixed event listeners being applied to other plugin's events.

### Changed
- Icons in multiple plugins no longer depend on Material Design Icons to work. They are now just simple text-based icons.


## [0.14.1] - 2019-07-01

### Fixed
- **Plugins.Modal**: Fixed lock scroll functionality.

### Added
- **Plugins.Modal**: Added screen reader text to the default modal close button.
- **Plugins.ProgressiveImage**: Added empty alt attribute to the thumbnail image.


## [0.14.0] - 2019-05-31

### Fixed
- **Events**: Fixed event listeners from lower levels not being de-registered when `.off()` is 
  called.

### Changed
- **Events**: Set all scroll and touch events to passive by default.
- **Plugins.Modal**: Change default close button from link tag to `<button>` tag.

### Added
- **Events**: Implemented `options` parameter for event listeners.


## [0.13.1] - 2019-05-08

### Fixed
- **Plugins.Dropdown**: Fixed reverse class not being applied correctly.


## [0.13.0] - 2019-05-08

### Fixed
- **Util.Css**: Fixed `getMaxTransitionDuration()` returning `NaN` if the `transition-delay` 
  property was not set.
- **Plugins.Dropdown**
  - Fixed click event not opening the dropdown.
  - Hide the element with `display: block` while the dropdown is closed.

### Added
- **Plugins.ProgressiveImage**: Added `fit` option to enable `object-fit` variations of the images.
  Progressive Images can now be used as background images, yay!


## [0.12.1] - 2019-04-02

### Fixed
- **Plugins.Modal**: Fix modal not aligning vertically.


## [0.12.0] - 2019-03-28

### Fixed
- **Util**: Automatically convert `"true"` and `"false"` strings to booleans.
- **Plugins.Chaser**: Fixed the limit function not grabbing the right placeholder height variable.
- **Plugins.Dropdown**: Fixed the dropdown toggling to the wrong state when the `triggerEvent`
  option is set to `"mouseover mouseleave"` and the mouse is already over the trigger element when
  the page is loaded.

### Changed
- **Plugins.Chaser**: Automatically set the `top` property to the offset between the page top and
  the placeholder object, so calculations may be properly done without the need of manually setting 
  CSS properties.

### Removed
- **Events.EventHelper**: This class was moved to the Event function as it being a separate class
  file just made it more complex to import (since it needed to be imported after the `Events` class)
  and it did not made any less costly in terms of system resources than it is now.

### Added
- **Plugins.BasePlugin**: Added methods to create and destroy listeners. This will make the 
  adding and removal of event listeners more streamlined and will prevent plugins from registering 
  events in the global event namespace, which might lead to errors when multiple events are 
  registered to the same element.
- **Plugins.Chaser**: Added an option to set the chasing element's width to be the same as the
  placeholder element's.
- **Events**: Added support to register arrays of event types.
- **History**: This revamped version of the old `HistoryState` only includes the strictly needed
  code to run in the supported browsers and can be used to listen to hash changes even when the
  browser already has native push states support.
- **Plugins.Tabbed**: The Tabbed plugin now supports hash changes. This feature is enabled by
  default and may be set to use native push states or turned off entirely. Also, by default the tab
  menu links won't trigger the default event anymore as that would result in undesired loops. 


## [0.11.0] - 2019-03-18

### Fixed
- **Plugins.Chaser**: Fix placeholder height not being updated.
- **Plugins.ScrollTrigger**
  - Fix offset being calculated in the wrong direction when `triggerPosition` is set to `top`.
  - Prevent event listeners from being registered multiple times.

### Changed
- **Dom**: `Dom.getAll()` will return `null` if the `selector` parameter is neither a string or an
  HTMLElement. 

### Added
- **Plugins.Chaser**: Added support to limiting the element to a certain point in the page. The
  property `limit` will be used for that purpose and it can be a number (checked with `!isNaN()`),
  a selector string or a function.


## [0.10.1] - 2019-03-15

### Fixed
- **Plugins.Chaser**: Fix undefined ScrollTrigger variable.


## [0.10.0] - 2019-03-15

### Fixed
- **Dom**: Now all valid selectors passed to query methods will be treated outside
  `document.querySelector()`. Before this fix selectors like `#element/id` (which are valid) would
  be sent to `querySelector()` and therefore generate an error since that method can't handle
  selectors outside CSS's own query selector.
- **Util.Css**: `Util.Css.getOffset()` now properly handles offsets when the `<html>` tag has
  margins set to it.

### Changed
- **Plugins.Chaser**: The Chaser plugin has been rewritten to reuse code from the ScrollTrigger
  plugin.

### Removed
- **HistoryState**: Both HistoryState and StackState have been removed since all modern browsers
  have support for push states.
- **Plugins.Excerpt**: Removed unused `excludeString` parameter.

### Added
- **Plugins.Excerpt**: Added support for HTML end tags.


## [0.9.0] - 2019-01-14

### Fixed
- An infinite loop that was triggered by the Mutation Observer when Progressive Images were added to
  the page.
- The Mutation Observer now only tries to init HTML Elements (vs all node types).
- `Dom.addClass()` and `Dom.removeClass()` will now fail silently if the class is null-equivalent.
- **Plugins.Excerpt**: Number of lines would not calculate properly if the `<br>` inside the trigger
  element were set to anything other than `display: block`.
- **Plugins.Reveal**
  - Multiple clicks in the same element won't break the state of the Reveal anymore.
  - Default inline styles are added if the element was already open before the plugin was 
    instantiated.
- **Plugins.ProgressiveImages**: Make sure the "original image" class is added to the image element.
- **Util.Css**: `Css.getOffset()` now properly calculates the right and bottom offsets.
- Some other small bugfixes.

### Changed
- Plugins won't be instantiated twice on the same element anymore.
- **Plugins.Select**: All classes set to the `<option>`s are now copied to their respective items in
  the Select.
- **Plugins.Excerpt**: The recalculation threshold is now 100ms by default.
- **HistoryState** is not jQuery-dependant anymore.

### Removed
- `sass/components/_offCanvas.scss` file was removed since it was not being used. To clarify, the
  current implementation of the OffCanvas plugin uses `Modal`'s JS classes and CSS selectors.

### Added
- New plugin: **OffCanvas** - This plugin will create an element that is hidden off-canvas to be
  displayed on user interaction (i.e. mobile menus that slide into view when the user clicks the 
  mobile menu button).
- New plugin: **VideoPlayer** - This plugin will create a video player in the page, displaying a
  placeholder (text, image, icon, whatever suits you best) until the video is playing.
- **Util**
  - `Util.getFormData()` now supports radio buttons and checkboxes.
  - `Util.setScrollTop()` is a new method that sets the Y scrolling position of the page.
  - `Util.scrollToElement()` is a new method that animates the scroll to a given element in the 
  page.
- Some other minor improvements and documentation comments in the code.


## [0.8.1] - 2018-11-08

### Fixed
- Mutation observer was running an infinite loop if Sushi.init() was called for an element.


## [0.8.0] - 2018-11-05

### Deprecated
- **Plugins.Modal**: `horizontalCentering` and `verticalCentering` options were replaced by the more
  flexible `position` string.

### Fixed
- **Dom**: `Dom.clone()` now clones child elements' events.
- **Plugins.Modal**: `closeOnEsc` wasn't working after the first modal closed by pressing Esc.
- **Plugins.Reveal**: Absolute positioned elements inside the Reveal content now follow the overflow
  hidden directive.

### Changed
- **Events**: The event stack is now handled with a Map instead of an object. That means event
  adding and removal are a little bit faster and the library is using somewhat less memory.
- Some comments and console log strings.

### Removed
- **Plugins.Modal**
  - `extraClasses` option.
  - Unused `updatePosition()` method.

### Added
- **Plugins.Modal**: `position` option has been added. Options available are `right`, `left`, 
  `bottom` and `top`, in addition to `center` (horizontal) and `middle` (vertical). The `position` 
  option should be set in pairs and can be set in any order (i.e. `right bottom` and `bottom right` 
  produce the same results). Defaults to `center top`.


## [0.7.0] - 2018-10-26

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


[0.20.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.20.0...0.20.1
[0.20.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.19.0...0.20.0
[0.19.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.18.2...0.19.0
[0.18.2]: https://github.com/dogandpony/sushi-bazooka/compare/0.18.1...0.18.2
[0.18.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.18.0...0.18.1
[0.18.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.17.2...0.18.0
[0.17.2]: https://github.com/dogandpony/sushi-bazooka/compare/0.17.1...0.17.2
[0.17.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.17.0...0.17.1
[0.17.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.16.2...0.17.0
[0.16.2]: https://github.com/dogandpony/sushi-bazooka/compare/0.16.1...0.16.2
[0.16.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.16.0...0.16.1
[0.16.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.15.0...0.16.0
[0.15.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.14.2...0.15.0
[0.14.2]: https://github.com/dogandpony/sushi-bazooka/compare/0.14.1...0.14.2
[0.14.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.14.0...0.14.1
[0.14.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.13.1...0.14.0
[0.13.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.13.0...0.13.1
[0.13.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.12.1...0.13.0
[0.13.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.12.1...0.13.1
[0.12.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.12.0...0.12.1
[0.12.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.11.0...0.12.0
[0.11.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.10.1...0.11.0
[0.10.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.10.0...0.10.1
[0.10.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.9.0...0.10.0
[0.9.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.8.1...0.9.0
[0.8.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.8.0...0.8.1
[0.8.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.7.0...0.8.0
[0.7.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.6.2...0.7.0
[0.6.2]: https://github.com/dogandpony/sushi-bazooka/compare/0.6.1...0.6.2
[0.6.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.6.0...0.6.1
[0.6.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.5.3...0.6.0
[0.5.3]: https://github.com/dogandpony/sushi-bazooka/compare/0.5.2...0.5.3
[0.5.2]: https://github.com/dogandpony/sushi-bazooka/compare/0.5.1...0.5.2
[0.5.1]: https://github.com/dogandpony/sushi-bazooka/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/dogandpony/sushi-bazooka/compare/0.4.7...0.5.0
[0.4.7]: https://github.com/dogandpony/sushi-bazooka/compare/0.4.6...0.4.7
[0.4.6]: https://github.com/dogandpony/sushi-bazooka/compare/0.4.5...0.4.6
[0.4.5]: https://github.com/dogandpony/sushi-bazooka/compare/0.4.4...0.4.5
