import { http } from '../utils/http';

export class GoogleTranslate {

  constructor(key, srcLang, targetLang) {
    this.key = key;
    this.srcLang = srcLang;
    this.targetLang = targetLang;
    this.url = 'https://www.googleapis.com/language/translate/v2?key=' + this.key;
  }

  getTranslations(words) {
    var promise = new Promise((resolve, reject) => {
      var promises = [],
        translations = [];

      this.url += '&source=' + this.srcLang + '&target=' + this.targetLang;
      words = this.toList(words);
      promises = this.getPromises(words);

      Promise.all(promises)
        .then((responses) => {
          let translations = this.combineTranslations(responses);
          let tMap = this.mapTranslations(translations, words);
          resolve(tMap);
        })
        .catch((e) => {
          reject(e);
        });
    });
    return promise;
  }

  toList(words) {
    var wordList = [];
    for (let word in words) {
      wordList.push(word);
    }
    return wordList;
  }

  getPromises(words) {
    var i = 0,
      promises = [],
      url = '',
      limitedWords = [];

    while (i < words.length) {
      url = this.url;
      limitedWords = words.slice(i, i + 128);
      for (let j in limitedWords) {
        url += '&q=' + limitedWords[j];
      }
      promises.push(http(url).get());
      i += 128;
    }

    return promises;
  }

  combineTranslations(responses) {
    var translations = [];
    for (let i in responses) {
      translations = translations.concat(JSON.parse(responses[i]).data.translations);
    }
    return translations;
  }

  mapTranslations(translations, words) {
    var tMap = {},
      i = 0,
      translatedWords = translations;

    for (let word in words) {
      // add a try catch block
      tMap[words[word]] = translatedWords[i].translatedText;
      i++;
    }
    console.log(tMap);
    return tMap;
  }

  translateSentence(text) {
    var promise = new Promise((resolve, reject) => {
      this.url += '&source=' + this.srcLang + '&target=' + this.targetLang;
      this.url += '&q=' + text;
      http(this.url)
        .get()
        .then((data) => {
          resolve(JSON.parse(data).data.translations[0].translatedText);
        })
        .catch((e) => {
          reject(e);
        });
    });
    return promise;
  }
}
