# markdown-proofing

[![npm](https://img.shields.io/npm/v/markdown-proofing.svg)](https://www.npmjs.com/package/markdown-proofing)
[![license](https://img.shields.io/npm/l/markdown-proofing.svg)](http://opensource.org/licenses/MIT)
[![github-issues](https://img.shields.io/github/issues/ritterim/markdown-proofing.svg)](https://github.com/ritterim/markdown-proofing/issues)
[![travis-status](https://img.shields.io/travis/ritterim/markdown-proofing.svg)](https://travis-ci.org/ritterim/markdown-proofing)
[![coveralls](https://img.shields.io/coveralls/ritterim/markdown-proofing.svg)](https://coveralls.io/github/ritterim/markdown-proofing)

A markdown proofing platform for individuals, teams, and organizations.

## Quickstart: Installation, usage, and build integrations

Install into your project:

```
> npm install markdown-proofing --save
```

Now, give it a test:

```
> node cli.js ./file1.md
```

Next, you could wire it up in your `package.json` as part of your build *(or, perhaps as a lint step, you decide!)*.

## Core concepts

There are two core concepts: **Analyzers** and **Rules**.

- **Analyzers** *process the text!*
  - Analyzers parse a markdown text string and return an `AnalyzerResult`, which includes a collection of `AnalyzerMessage` objects.
    - `AnalyzerMessage`'s are simply `{ type: String, message: String }`.
  - There are useful analyzers built-in and ready for use. Custom analyzers are supported as well.
- **Rules** *react to analyzers!*
  - These react to the output of the configured analyzers. Without any rules, the output of the analyzers is not surfaced to the user or applied in any way. So, you'll need some rules!
  - Rules are in the format of `'{{message-type}}': '{{condition}}'`.
    - Example rule: `'statistics-word-count': 'info'`
    - Example rule: `'statistics-flesch-kincaid-reading-ease': 'warning < 40'`
  - There are **four** kinds for rules, `info`, `warning`, `error`, and `none`.
    - `info` signals to add this to any output. It should show up in build results and any place where messages should be visible.
    - `warning` is a standard *warning*, it shouldn't fail a build.
    - `error` violations should result in a build failure.
    - `none` is used to override a preset.
  - Rules can have an optional condition, which is applied as `warning < 40` -- it's a `warning` only when the value is less than `40`.
    - This is useful for statistics and other numerical outputs from analyzers.

## TODO

There are built-in presets for analyzers and rules. Or, you can supply your own -- optionally extending a preset!

## Potential future features

- Describe location of potential problems
- Automatic reports to GitHub pull requests based on build results.

## Configuration

Configuration is specified in JSON. By default markdown-proofing reads from a `.markdown-proofing` JSON configuration file from the root of the target project. You can optionally supply a different file, if you'd like.

An example configuration file might be:

```json
{
  "presets": [],
  "analyzers": [
    "buzzwords",
    "fillers",
    "passive-voice",
    "require-oxford-commas",
    "sensitivity",
    "sentiment",
    "spelling",
    "statistics",
    "write-good"
  ],
  "rules": {
    "spelling-error": "error",
    "missing-oxford-commas": "error",
    "statistics-flesch-kincaid-reading-ease": "warning <= 40",
    "statistics-flesch-kincaid-grade-level": "warning > 12",
    "sentiment-score": "info",
    "sentiment-comparative-score": "info"
  }
}
```

## Custom Analyzers

```javascript
import AnalyzerResult from './analyzer-result'; // TODO: Change this import to allow for outside scripts to use it

export default class MyCustomAnalyzerAnalyzer {
  analyze(str) {
    const result = new AnalyzerResult();

    result.addMessage('my-custom-analyzer-message-type', 'some-value');

    return result;
  }
}
```

Then, simply wire it up!

```
TODO
```

## Author

Ritter Insurance Marketing

## License

**MIT**

## Contributing

Contributions are highly welcome!

If you construct a useful analyzer, we'd appreciate a pull request to incorporate it into the project!
