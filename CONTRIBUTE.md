MTW - Contributing
==================

This package uses `jspm` to manage modules for javascript.

To have a development copy of the code, clone the repository. Run the following commands in your cloned directory.

```shell
npm install -g jspm gulp gulp-cli jsdoc karma-cli
npm install
jspm install
```

Install the extension in Chrome as an unpacked extension. Install the folder which has `manifest.json`

**To start the chrome application**, run

```shell
gulp watch
```

**To generate docs**, run

```shell
jsdoc -c config.json
```

Content Script: `mtw.js`

Event Page (background script): `eventPage.js`
