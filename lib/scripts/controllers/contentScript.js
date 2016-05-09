/*
1. ngram deprecate
2. getAllWords optimize
3. replace toList with ES6 Array.from and destructing
4. remove injectCSS and injectScript
*/

export class ContentScriptCtrl {
  constructor() {
    this.srcLang = '';
    this.targetLang = '';
    this.ngramMin = 1;
    this.ngramMax = 1;
    this.translate();
  }

  translate() {
    chrome.runtime.sendMessage({getOptions: '1'}, (res) => {
      console.log('options:',res);
      if (res.activation === true){
        this.ngramMin = res.ngramMin;
        this.ngramMax = res.ngramMax;
        this.srcLang = res.sourceLanguage;
        this.targetLanguage = res.targetLanguage;

        var countedWords = this.getAllWords(this.ngramMin, this.ngramMax);
        var filteredWords = this.
        console.log(countedWords);
      } else {
        console.log('switched off');
      }
    });
  }

  getAllWords(ngramMin, ngramMax) {
    console.log('getAllWords: ngramMin = ' + ngramMin + '; ngramMax = ' + ngramMax);
    var countedWords = {};
    var paragraphs = document.getElementsByTagName('p');
    console.log('Getting words from all ' + paragraphs.length + ' paragraphs');
    for (var i = 0; i < paragraphs.length; i++) {
      var words = paragraphs[i].innerText.split(/\s|,|[.()]|\d/g);
      for (var j = 0; j < words.length; j++) {
        for (var b = ngramMin; b <= ngramMax; b++) {
          var word = words.slice(j, j + b).join(' ');
          if (!(word in countedWords)) {
            countedWords[word] = 0;
          }
          countedWords[word] += 1;
        }
      }
    }
    return countedWords;
  }


}
