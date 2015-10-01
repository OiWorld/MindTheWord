describe('getAllWords function', function() {

  // sometimes it takes time to start phantomjs
  this.timeout(4000);
  var FILENAME = 'Tests/data/sample_page.html';

  it('should generate the correct list of words', function(done) {
    page.open(FILENAME, function() {

      // generate words list for testing
      page.injectJs('Source/MindTheWord.js');
      var word_list = page.evaluate(function() {
        var ngramMin = 1;
        var ngramMax = 3;
        return getAllWords(ngramMin, ngramMax);
      });

      // load correct, pre-defined word list
      var correct_word_list = JSON.parse(fs.read('Tests/data/all_words.txt'));

      // check equality
      page.evaluate(function(a, b) {
        chai.expect(a).to.deep.equal(b);
      }, word_list, correct_word_list);

      done();

    });
  });
});
