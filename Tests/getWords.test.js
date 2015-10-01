describe('getAllWords function', function() {

  // sometimes it takes time to start phantomjs
  this.timeout(4000);
  var FILENAME = 'Tests/data/samplePage.html';

  it('should generate the correct list of words', function(done) {
    page.open(FILENAME, function() {

      // generate words list for testing
      page.injectJs('Source/MindTheWord.js');
      var wordList = page.evaluate(function() {
        var ngramMin = 1;
        var ngramMax = 3;
        return getAllWords(ngramMin, ngramMax);
      });

      // load correct, pre-defined word list
      var correctWordList = JSON.parse(fs.read('Tests/data/allWords.json'));

      // check equality
      page.evaluate(function(a, b) {
        chai.expect(a).to.deep.equal(b);
      }, wordList, correctWordList);

      done();

    });
  });
});
