# markdown-proofing

[![npm](https://img.shields.io/npm/v/markdown-proofing.svg)](https://www.npmjs.com/package/markdown-proofing)
[![license](https://img.shields.io/npm/l/markdown-proofing.svg)](http://opensource.org/licenses/MIT)
[![github-issues](https://img.shields.io/github/issues/ritterim/markdown-proofing.svg)](https://github.com/ritterim/markdown-proofing/issues)
[![travis-status](https://img.shields.io/travis/ritterim/markdown-proofing.svg)](https://travis-ci.org/ritterim/markdown-proofing)
[![coveralls](https://img.shields.io/coveralls/ritterim/markdown-proofing.svg)](https://coveralls.io/github/ritterim/markdown-proofing)

A markdown proofing platform for individuals, teams, and organizations.

## Features / Ideas

- Read US English markdown text to check for issues and provide statistics.
- Configurable response to analysis with info, warnings, or errors.
- Pluggable into modern development platform build processes

## Potential future features

- Describe location of potential problems
- Automatic reports to GitHub pull requests based on build results.

## Install

```
> npm install markdown-proofing
```

## Usage

```
> node cli.js ./file1.md
```

## Configuration

**Configuration is TODO / WIP**

Configuration might be read from a `.markdown-proofing` file from the root of the target project.

An example configuration file might be:

```json
{
  "extends": [],
  "analyzers": [
    "buzzwords",
    "fillers",
    "passive-voice",
    "require-oxford-commas",
    "sensitivity",
    "sentiment",
    "spelling",
    "statistics",
    "weasel-words",
    "write-good"
  ],
  "rules": {
    "spelling-error": "error",
    "missing-oxford-commas": "error",
    "statistics-flesch-kincaid-reading-ease": "warning <= 40",
    "statistics-flesch-kincaid-grade-level": "warning > 12",
    "sentiment-score": "info",
    "sentiment-comparative-score": "info",
  }
}
```

## Author

Ritter Insurance Marketing

## License

**MIT**

## Contributing

Contributions are highly welcome!
