describe('filterSourceWordsPreferUserDefined function', function() {

  // sometimes it takes time to start phantomjs
  this.timeout(4000);
  var FILENAME = 'Tests/data/samplePage.html';

  it('should correctly filter word list', function(done) {
    page.open(FILENAME, function() {

      var wordList = JSON.parse(fs.read('Tests/data/allWords.json'));
      var correctFilteredWordList = JSON.parse(fs.read('Tests/data/filteredWords.json'));
      var userDefinedTranslations = JSON.parse(fs.read('Tests/data/userDefinedTranslations.json'));

      // filter word list
      page.injectJs('Source/MindTheWord.js');
      var filteredWordList = page.evaluate(function(wordList, userDefinedTranslations) {

        var countedWords = wordList;
        var translationProbability = 15.0;
        var minimumSourceWordLength = 1;
        var userBlacklistedWords = "(this|that)";
        return filterSourceWordsPreferUserDefined(countedWords, translationProbability, userDefinedTranslations);

      }, wordList, userDefinedTranslations);

      // check equality
      page.evaluate(function(a, b) {
        chai.expect(a).to.deep.equal(b);
      }, filteredWordList, correctFilteredWordList);

      done();

    });
  });
});
