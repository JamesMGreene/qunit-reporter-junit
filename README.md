[![Build Status](https://travis-ci.org/JamesMGreene/qunit-reporter-junit.svg?branch=master)](https://travis-ci.org/JamesMGreene/qunit-reporter-junit) [![NPM version](https://badge.fury.io/js/qunit-reporter-junit.svg)](http://badge.fury.io/js/qunit-reporter-junit)
# JUnit Reporter for QUnit

A QUnit plugin that produces JUnit-style XML test reports (e.g. for integration into build tools like Jenkins).


## Usage

### New API

Include the plugin script ("qunit-reporter-junit.js") after the QUnit core script itself, then register callback(s) using `jUnitDone` to do something with the XML string (e.g. upload it to a server):

```js
QUnit.jUnitDone(function(report) {
  if (typeof console !== 'undefined') {
    console.log(report.xml);
  }
});
```

With this new API (as of `v1.1.0`), you can even register a callback after the tests have finished and still successfully receive the data (so long as the "qunit-reporter-junit.js" script was included before the test run began).


### Old API

The old API approach of implementing the `jUnitReport` hook is also still supported:

```js
QUnit.jUnitReport = function(report) {
  if (typeof console !== 'undefined') {
    console.log(report.xml);
  }
};
```

With this old API, you **MUST** implement the callback before the tests have finished or else you will never receive the data.


## Notes

If you're using Grunt, you should take a look [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit).
