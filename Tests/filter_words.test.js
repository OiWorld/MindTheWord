describe('filterSourceWords function', function() {

  // sometimes it takes time to start phantomjs
  this.timeout(4000);
  var FILENAME = 'Tests/data/sample_page.html';

  it('should correctly filter word list', function(done) {
    page.open(FILENAME, function() {

      // load pre-defined word list
      var word_list = JSON.parse(fs.read('Tests/data/all_words.txt'));
      var correct_filtered_word_list = JSON.parse(fs.read('Tests/data/filtered_words.txt'));

      // filter word list
      page.injectJs('Source/MindTheWord.js');
      var filtered_word_list = page.evaluate(function(word_list) {

        var countedWords = word_list;
        var translationProbability = 15.0;
        var minimumSourceWordLength = 1;
        var userBlacklistedWords = "(this|that)";
        return filterSourceWordsPreferUserDefined(countedWords, translationProbability, minimumSourceWordLength, userBlacklistedWords);

      }, word_list);

      console.log(filtered_word_list.length);
      console.log(correct_filtered_word_list.length);

      // check equality
      page.evaluate(function(a, b) {
        chai.expect(a).to.deep.equal(b);
      }, filtered_word_list, correct_filtered_word_list);

      done();

    });
  });
});
