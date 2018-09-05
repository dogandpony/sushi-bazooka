# Sushi Bazooka
>Component-based JavaScript library

Sushi Bazooka has a set of reusable, little opinionated components — what means they will be most
likely be missing styling until you add them yourself. Opinionated properties will be commented-out 
in the code to serve as examples of where you should be styling things.


### Including your styles

You should include your styles after including the base styles from Sushi Bazooka. In your main SCSS
file it might look like the following:

```scss
@import "node_modules/sushi-bazooka/sass/components/chaser"; // base styles
@import "mysite/components/chaser"; // opinionated styles
```


### Wait... I'm overriding rules now

Yes, you are. And, of course, this is pretty bad. But at least now you have a somewhat pre-built
list of JavaScript components that can be used as-is if you'd like **or** can be overridden with
your own styles.

But if you think that's not a good reason to break the cleanliness of your code, [clean-css] got you
covered with the merge flags in its [Level 2 Optimizations]. Win-win.


### Sushi Base

Most components rely on the global spacing variables included by default in [Sushi Base] and it's
assumed that you will include Sushi Bazooka alongside Sushi Base. Working with Sushi Bazooka own 
its own is **not** supported and **will not** work unless you spend a fair amount of time building 
its dependencies from scratch.


### Variables

Some components (like Reveal) may have opinionated but required properties (like Reveal's transition
duration). Those properties have a default reasonable value and may be customized through variables,
which are set at the very beginning of each component's SCSS file. Usually we don't go that route 
because maintaining a big set of variables defeats the purpose of using an object-oriented approach 
to CSS, but sometimes (like inside a placeholder class that can't be easily overridden) that's the
only way to make things work while keeping a minimum of customization options.

Current customizable global variables are:

 - **`$globalTransitionTimingFunction`** *`CSS easing function`*, default: `ease-in-out` -- Global 
   timing function to be used for all transitions. Any easing function from [easings.net] should 
   work on all major browsers.
 - **`$globalBorderRadius`** *`pixels`*, default: `3px` -- Base border radius used across

You can see more variables in `settings/_variables.scss`, where you will also find further comments
on their use.


### No JS

[Sushi Base]:https://github.com/dogandpony/sushi-base
[easings.net]:https://easings.net
[clean-css]:https://github.com/jakubpawlowicz/clean-css
[Level 2 Optimizations]:https://github.com/jakubpawlowicz/clean-css#level-2-optimizations
