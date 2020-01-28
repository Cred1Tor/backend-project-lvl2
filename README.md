# Gendiff

[![Build Status](https://travis-ci.com/Cred1Tor/backend-project-lvl2.svg?branch=master)](https://travis-ci.com/Cred1Tor/backend-project-lvl2)
[![Maintainability](https://api.codeclimate.com/v1/badges/ac6b56f271a080a70539/maintainability)](https://codeclimate.com/github/Cred1Tor/backend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ac6b56f271a080a70539/test_coverage)](https://codeclimate.com/github/Cred1Tor/backend-project-lvl2/test_coverage)


A tool for comparing configuration files

## Installation

Clone the repository, run `npm link` from inside the repository.

## Usage

Use `gendiff -h` for help.

General use: `gendiff <file> <file>`

Files must be of these extensions: .json, .ini, .yml.

Use -f (--format) flag to choose output format: `gendiff -f plain <file> <file>`

Possible formats are: tree (default), plain, json.

## Examples

Consider the comparable files are:
```
{
  "common": {
    "setting1": "Value 1",
    "setting2": 200,
    "setting3": true,
    "setting6": {
      "key": "value"
    }
  },
  "group1": {
    "baz": "bas",
    "foo": "bar",
    "nest": {
      "key": "value"
    }
  },
  "group2": {
    "abc": 12345
  }
}
```
and
```
{
  "common": {
    "follow": false,
    "setting1": "Value 1",
    "setting3": {
      "key": "value"
    },
    "setting4": "blah blah",
    "setting5": {
      "key5": "value5"
    },
    "setting6": {
      "key": "value",
      "ops": "vops"
    }
  },

  "group1": {
    "foo": "bar",
    "baz": "bars",
    "nest": "str"
  },

  "group3": {
    "fee": 100500
  }
}
```

Expected output would be:

Tree:
```
{
    common: {
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: {
            key: value
        }
        setting6: {
            key: value
          + ops: vops
        }
      + follow: false
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
    }
  + group3: {
        fee: 100500
    }
}
```

Plain:
```
Property 'common.setting2' was removed.
Property 'common.setting3' was updated. From true to [complex value]
Property 'common.setting6.ops' was added with value: vops
Property 'common.follow' was added with value: false
Property 'common.setting4' was added with value: blah blah
Property 'common.setting5' was added with value: [complex value]
Property 'group1.baz' was updated. From bas to bars
Property 'group1.nest' was updated. From [complex value] to str
Property 'group2' was removed.
Property 'group3' was added with value: [complex value]
```

Json:
```
[
  {
    "key": "common",
    "status": "nestedDiff",
    "value": [
      {
        "key": "setting1",
        "status": "unchanged",
        "value": "Value 1"
      },
      {
        "key": "setting2",
        "status": "removed",
        "value": 200
      },
      {
        "key": "setting3",
        "status": "updated",
        "oldValue": true,
        "newValue": {
          "key": "value"
        }
      },
      {
        "key": "setting6",
        "status": "nestedDiff",
        "value": [
          {
            "key": "key",
            "status": "unchanged",
            "value": "value"
          },
          {
            "key": "ops",
            "status": "added",
            "value": "vops"
          }
        ]
      },
      {
        "key": "follow",
        "status": "added",
        "value": false
      },
      {
        "key": "setting4",
        "status": "added",
        "value": "blah blah"
      },
      {
        "key": "setting5",
        "status": "added",
        "value": {
          "key5": "value5"
        }
      }
    ]
  },
  {
    "key": "group1",
    "status": "nestedDiff",
    "value": [
      {
        "key": "baz",
        "status": "updated",
        "oldValue": "bas",
        "newValue": "bars"
      },
      {
        "key": "foo",
        "status": "unchanged",
        "value": "bar"
      },
      {
        "key": "nest",
        "status": "updated",
        "oldValue": {
          "key": "value"
        },
        "newValue": "str"
      }
    ]
  },
  {
    "key": "group2",
    "status": "removed",
    "value": {
      "abc": 12345
    }
  },
  {
    "key": "group3",
    "status": "added",
    "value": {
      "fee": 100500
    }
  }
]
```

## Asciinemas

### Flat, all file types

[![asciicast](https://asciinema.org/a/n164Y7ntRuy8tcxYMH5M9xCIO.svg)](https://asciinema.org/a/n164Y7ntRuy8tcxYMH5M9xCIO)

### Nested, all format modes

[![asciicast](https://asciinema.org/a/EFGhzlfeq13nws37YMfdDQNcl.svg)](https://asciinema.org/a/EFGhzlfeq13nws37YMfdDQNcl)
