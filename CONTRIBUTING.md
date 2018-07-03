# Contributing
Note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process
1. Ensure any install, build and test run perfectly.
2. Update documentation and test for each changement.
3. Increase the version numbers for any occurence to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge your Pull Request once you have the approbation from an official 20 Minutes developer.

## Code convention
This part gives a few guidelines about writing css and templates for 20mn front end.
Note that this documentation is still in WIP.

### Linters
Colette use [ESLint](https://eslint.org/), [EditorConfig](https://editorconfig.org/) and [Stylint](https://simenb.github.io/stylint/).
For a better experience you should add support for this tools to you development software.

### JS
Colette javascript follow [20 Minutes eslint config](https://github.com/20minutes/eslint-config)

- all class names and selectors used in javascript must be configurable
- use ES6 and vanilla js only
- recommand usage of polyfill if necessary for some browser support

### Stylus
We use [Stylus preprocessor](http://stylus-lang.com/), in combination with [PostCSS](https://postcss.org/), to provide CSS for 20 Minutes front end.

#### Writing conventions

##### Be lazy

###### No braces `{}`:
```stylus
body
    font-size: 16px;
```

###### No semi-colons `;`:
```stylus
body
    font-size: 16px
```

###### And no colons either `:`:
```stylus
body
    font-size 16px
```

##### Indentation
Use 4 spaces indentation

##### Nesting
Use nested declarations for better readability:
```stylus
.component
    /* .component styles here */

    &-list
      /* .component-list styles here */

      > li
        /* .component styles here */
```
Instead of:
```stylus
.component
    /* .component styles here */

.component-list
    /* component-list styles here */

.component-list > li
    /* .component-list > li styles here */
```

##### Variables
Make them start with a `$` sign, e.g.:
```stylus
$color-base = #4c4d4e  // Default text color
```

##### Classes naming
- Use english names in camelCase if composed
- Use hyphens (`-`) to separate component name to modifier or child name
- Avoid content or context related class name, it should be related to UI

#### Pseudo classes/elements
- `:after` and `:before` -> Use single colon notation to ensure IE8 support
- `:last-child` is not supported by IE8 -> Deal with `:first-child` instead if possible

#### Colors
- Must be a variable
- Use hexadecimal format
- Lowercase
- Short notation if possible

Write `#fff` instead of `#ffffff` or `#FFFFFF` or `#FFF`.

#### Mixins first
Declare mixins before CSS properties:
```stylus
.foo
    _myMixin()
    display block
```
Instead of:
```stylus
.foo
    display block
    _myMixin()
```

#### Use standard CSS
If you need some future css, prefixed or add an hack, let this job to PostCSS.

#### Stylus files organisation

- __Settings__: Variables of the projects
- __Mixins__: Stylus mixins
- __@blocks__: Stylus blocks for factorisation related to design system
- __Elements__: Indivisible UI element (named “atom” in Atomic Design method)
- __Components__: Bloc of UI, it can contain or be composed by other elements or components (named “molecule” in Atomic Design method)
- __Themes__: Classes able to alter colors of some components and/or elements
- __Helpers__: Small utils classes with only one css property

## Code of Conduct

This Code of Conduct is adapted from the [Contributor Covenant](http://contributor-covenant.org), [version 1.4](http://contributor-covenant.org/version/1/4)

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at web-tech@20minutes.fr. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.
