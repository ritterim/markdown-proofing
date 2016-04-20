# markdown-proofing

[![npm](https://img.shields.io/npm/v/markdown-proofing.svg)](https://www.npmjs.com/package/markdown-proofing)

A markdown proofing platform for individuals, teams, and organizations.

## Quickstart: Installation, usage, and build integrations

Install into your project:

```
> npm install markdown-proofing
```

Now, create a `.markdown-proofing` JSON file in the root of your project. Here's a simple one using a preset to get started:

```json
{
  "presets": ["technical-blog"]
}
```

Now, run it *(may require global npm installation to run directly at command line)*:

```
> markdown-proofing ./file1.md
```

Next, you could wire it up in your `package.json` as part of your build *(or, perhaps as a lint step, you decide!)*.

## Usage with Jekyll / Static Site Generators

*This section is centered around [Jekyll](https://jekyllrb.com/), but may work with other static site generators, too!*

[Jekyll](https://jekyllrb.com/) itself doesn't use npm. But, markdown-proofing can still be used!

First, check if a `package.json` file exists in the repository root. If one does, great! If not, no problem -- simply create one using `npm init`.

After `package.json` exists, run `npm install markdown-proofing --save-dev`. This assumes you won't need this package available in your production environment.

Then, add or modify the `package.json` `test` script:

```json
"scripts": {
  "test": "markdown-proofing _posts/*.md"
},
```

Adjust the above as necessary if the posts live in a different place, or if you use a different file extension.

Now, use `npm test` to run markdown-proofing on the posts!

## Configuration

Configuration is specified in JSON. By default markdown-proofing reads from a `.markdown-proofing` JSON configuration file from the root of the target project. You can optionally supply a different file, if you'd like.

The configuration can be as simple as:

```json
{
  "presets": ["technical-blog"]
}
```

Or, a bit more complex:

```json
{
  "presets": [],
  "analyzers": [
    "require-oxford-commas",
    "sensitivity",
    "sentiment",
    "spelling",
    "statistics",
    "write-good"
  ],
  "rules": {
    "missing-oxford-commas": "error",
    "sensitivity": "warning",
    "sentiment-score": "info",
    "sentiment-comparative-score": "info",
    "spelling-error": "error",
    "statistics-flesch-kincaid-grade-level": "info",
    "statistics-flesch-kincaid-grade-level": "warning > 12",
    "statistics-flesch-kincaid-reading-ease": "warning <= 40",
    "write-good": "info"
  }
}
```

## Spellcheck

The `SpellingAnalyzer` implements [markdown-spellcheck](https://www.npmjs.com/package/markdown-spellcheck). This package uses a `.spelling` file for permitting unrecognized text.

[markdown-spellcheck](https://www.npmjs.com/package/markdown-spellcheck) also includes an interactive CLI, which you can use to interactively fix spelling and update the `.spelling` file as necessary. You may find this useful.

## Core concepts

There are two core concepts: **Analyzers** and **Rules**.

- **Analyzers** *process the text!*
  - Analyzers parse a markdown text string and return an `AnalyzerResult`, which includes a collection of `AnalyzerMessage` objects.
    - `AnalyzerMessage`'s are `{ type: String, text: String, line: Number, column: Number }`.
  - There are useful analyzers built-in and ready for use. Custom analyzers are supported as well.
- **Rules** *react to analyzers!*
  - These react to the output of the configured analyzers. Without any rules, the output of the analyzers is not surfaced to the user or applied in any way. So, you'll need some rules!
  - Rules are in the format of `'{{message-type}}': '{{condition}}'`.
    - Example rule: `'statistics-word-count': 'info'`
    - Example rule: `'statistics-flesch-kincaid-reading-ease': 'warning < 40'`
  - There are **four** types of rules: `info`, `warning`, `error`, and `none`.
    - `info` signals to add this to any output. It should show up in build results and any place where messages should be visible.
    - `warning` is a standard *warning*, it shouldn't fail a build.
    - `error` violations should result in a build failure.
    - `none` is used to override a preset.
  - Rules can have an optional condition, which is applied as `warning < 40` -- it's a `warning` only when the value is less than `40`.
    - This is useful for statistics and other numerical outputs from analyzers.

## Custom Analyzers

```javascript
import AnalyzerResult from 'markdown-proofing/analyzer-result'; // TODO: Change this import if this is not correct

export default class MyCustomAnalyzerAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    // As part of the logic, optionally add one or more messages:
    result.addMessage('my-custom-analyzer-message-type', 'some-value');

    // The return value can be an `AnalyzerResult`
    // or a promise to return an `AnalyzerResult`.
    return result;
  }
}
```

Then, simply wire it up in configuration as an `analyzers` array item:

```json
{
  "presets": [
  ],
  "analyzers": [
    "path/to/custom-analyzer"
  ],
  "rules": {
    "custom-analyzer-message": "info"
  }
}

```

## Author

Ritter Insurance Marketing

## License

**MIT**

## Contributing

Contributions are highly welcome!

If you construct a useful analyzer, we'd appreciate a pull request to incorporate it into the project!
