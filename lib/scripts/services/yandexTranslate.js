import { http } from '../utils/http'

export class YandexTranslate {
  constructor(key, srcLang, targetLang) {
    // check key
    this.key = key;
    this.srcLang = srcLang;
    this.targetLang = targetLang;
    this.url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + this.key;
  }

  getTranslations(words) {
    var promise = new Promise((resolve, reject) => {
      this.url += '&lang=' + this.srcLang + '-' + this.targetLang;
      for (var word in words) {
        this.url += '&text=' + word.trim(' ');
      }
      http(this.url)
        .get()
        .then((data) => {
          console.log('words', words);
          var tMap = this.mapTranslations(JSON.parse(data), words)
          resolve(tMap);
        })
    });
    return promise;
  }

  mapTranslations(data, words) {
    var tMap = {},
      i = 0,
      translatedWords = data.text;

    console.log(words);
    console.log(translatedWords);
    for (let word in words) {
      // add a try catch block
      tMap[word] = translatedWords[i]
      i++;
    }
    return tMap;
  }

  translateSentence(text) {
    var promise = new Promise((resolve, reject) => {
      this.url += '&lang=' + this.srcLang + '-' + this.targetLang;
      this.url += '&text=' + text;
      http(this.url)
        .get()
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
    return promise;
  }
}
