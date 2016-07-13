import { http } from '../utils/http';

/** Class for Yandex Translate */
export class YandexTranslate {

  /**
   * Initialize options and credentials
   * @constructor
   * @param {Object} key - Yandex key
   * @param {string} srcLang - source languages
   * @param {string} targetLang - target language
   */
  constructor(key, srcLang, targetLang) {
    // check key
    this.key = key;
    this.srcLang = srcLang;
    this.targetLang = targetLang;
    this.url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + this.key;
  }

  /**
   * Posts a request for translations and returns a promise.
   * @param {Object} - list of words
   * @returns {Promise} - On resolution gives translation map
   */
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
          var tMap = this.mapTranslations(JSON.parse(data), words);
          resolve(tMap);
        });
    });
    return promise;
  }

  /**
   * Map source words to translations
   * @param {Array} translations - list of translated words
   * @param {Object} words - source words list
   * @returns {Object} tMap - translation map
   */
  mapTranslations(data, words) {
    var tMap = {},
      i = 0,
      translatedWords = data.text;

    for (let word in words) {
      // add a try catch block
      tMap[word] = translatedWords[i];
      i++;
    }
    return tMap;
  }

  /**
   * Translate an entire input sentence
   * @param {string} text - sentence
   * @returns {Promise} promise - gives translated sentence on resolution
   */
  translateSentence(text) {
    var promise = new Promise((resolve, reject) => {
      this.url += '&lang=' + this.srcLang + '-' + this.targetLang;
      this.url += '&text=' + text;
      http(this.url)
        .get()
        .then((data) => {
          resolve(JSON.parse(data).text[0]);
        })
        .catch((e) => {
          reject(e);
        });
    });
    return promise;
  }
}
