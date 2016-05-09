MTW JSPM
========

This package uses `jspm` to manage modules for javascript.

Follow these steps
1. clone the repo

```shell
npm install -g jspm
npm install
jspm install
```

2. Navigate into `/frest_mtw/lib`
3. Run the following command

`jspm bundle-sfx lib/scripts/app mtw.js`

4. Refresh the chrome extension and it will have the new changes

Content Script: `mtw.js`
Event Page (background script): `eventPage.js`
