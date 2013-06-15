MindTheWord
===========

An extension for Google Chrome that helps people learn new languages while they browse the web.

The extension is available for free at the [Chrome Web Store](https://chrome.google.com/webstore/detail/mind-the-word/fabjlaokbhaoehejcoblhahcekmogbom).


MindTheWord helps the user to effortlessly learn vocabulary of a new language while browsing pages in his native language. In every webpage visited, it randomly translates a few words into the language he would like to learn. Since only a few words are translated, it is easy to infer their meaning from the context.



ChangeLog:
-----------------

Version 1.4:
- Upgrade to manifest 2


Version 1.3:
- Simplified options page.
- Fixed CSS for reddit.com.
- Known bugs: translation from languages like chinese is not working.


Version 1.2:
- Fixed the bug that caused chinese words to appear with a chinese dot (\u3002) in the end.
- Added the minimum word length option.
- Added the translated word CSS style option.
- Added the possibility of having user-defined translations.

Version 1.1:
- Limited the size per request, in order to avoid error 414 ("URI too large").
- Added the possibility of selecting the source language, because Google's auto-detection was not working very well

Version 1.0:
- Prevented replacements inside "input", "texture" and "script" elements.
- Added UrRev monetization.

Version 0.3.2:
- Fixed "undefined" bug. 

Version 0.3.1:
- Corrected PayPal "donation" code.

Version 0.3:
- Added Amazon ads in options page.
- Fixed bug related to the translation of words that are translated to the empty string.
- Added "0%" as a possible translation probability in the options page. 

Version 0.2:
- Made tooltip more efficient and less buggy.

Version 0.1:
- First release.




Known bugs:
------------------

1) CSS is not added in reddit.com .
2) Useless injection is being performed.
3) translates much less than according to the selected translation probability.
4) Default "auto-detect" is not good.




