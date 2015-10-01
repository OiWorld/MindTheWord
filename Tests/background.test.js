/*
 * Background page tests
 */

describe('my test', function() {

  // sometimes it takes time to start phantomjs
  this.timeout(4000);

  // empty html page aka generated background page
  var FILENAME = 'Tests/data/bbc-news-article.html';

  it('should do something', function(done) {
    page.open(FILENAME, function() {

      page.injectJs('Source/MindTheWord.js');

      page.evaluate(function() {

        var ngramMin = 1;
        var ngramMax = 3;
        var allWords = getAllWords(ngramMin, ngramMax);
        console.log("Found list of all words: " + allWords);

      });

      /*
      // assert
      page.evaluate(function() {
        sinon.assert.calledOnce(chrome.browserAction.setBadgeText);
        sinon.assert.calledWithMatch(chrome.browserAction.setBadgeText, {
            text: "2"
        });
      });
      */

      done();

    });
  });

});
