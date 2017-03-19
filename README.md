MindTheWord
===========
An extension for Google Chrome that helps people learn new languages while they browse the web.

MindTheWord helps the user to easily learn the vocabulary of a new language
while browsing pages in his native language. In every web page visited, it
randomly translates a few words into the language he would like to learn.
Since only a few words are translated, it is easy to infer their meaning from
the context.
Read more in [Description.md](Description.md).

## Installation:

### Install through Chrome Web Store
[![https://chrome.google.com/webstore/detail/mind-the-word/fabjlaokbhaoehejcoblhahcekmogbom](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_340x96.png)](https://chrome.google.com/webstore/detail/mind-the-word/fabjlaokbhaoehejcoblhahcekmogbom)

### or Load by Yourself
1. Install [node.js](https://nodejs.org), [git](https://git-scm.com)
2. Clone the repository
	`git clone https://gitlab.com/aossie/MindTheWord.git`
3. Change directory to MindTheWord
	`cd MindTheWord`
4. `npm install -g jspm gulp`
5. `npm install`
6. `jspm install`
7. `gulp build`
8. Open Chrome and go to `chrome://extensions`
9. Enable "Developer mode"
10. Drag  "dist" folder into the browser or click "Load unpacked extension" and select the "dist" folder.

Testing
-------
run `npm test`

How to Contribute
-------------
If you would like to contribute to the development of this extension, please [contact the developers](http://www.aossie.org/#contact).
In order to get started with the contribution, please refer to:
[Contribute.md](https://gitlab.com/aossie/MindTheWord/blob/master/CONTRIBUTE.md)

* [Google Summer of Code](GoogleSummerOfCode.md) grants are available every year. If you would like to apply, it is never too early to [contact us](http://www.aossie.org/#contact).

Licenses
--------

* GNU-GPL-3.0

* CC-By-NC-ND [![License](https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-nd/4.0/)
