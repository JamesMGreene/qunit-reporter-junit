[![Build Status](https://travis-ci.org/jquery/qunit-reporter-junit.png)](https://travis-ci.org/jquery/qunit-reporter-junit)

# JUnit reporter for QUnit

A QUnit plugin that produces JUnit-style XML test reports (e.g. for integration into build tools like Jenkins).

## Usage

Include the plugin script after QUnit itself, then implement the `jUnitReport` hook to do something with the XML string (e.g. upload it to a server):

```js
QUnit.jUnitReport = function(report) {
	console.log(report.xml);
};
```

## Notes

If you're using Grunt, you should take a look [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit).
