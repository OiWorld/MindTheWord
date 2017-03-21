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
      var promises = [],
        translations = [];

      words = this.toList(words);
      promises = this.getPromises(words);

      Promise.all(promises)
        .then((responses) => {
          let translations = this.combineTranslations(responses);
          // console.log(translations);
          let tMap = this.mapTranslations(translations, words);
          resolve(tMap);
        })
        .catch((e) => {
          reject(e);
        });
    });
    return promise;
  }

  /**
   * Convert object to list
   * @param {Object} words - words object
   * @returns {Array} wordList - array of words
   */
  toList(words) {
    var wordList = [];
    for (let word in words) {
      wordList.push(word);
    }
    return wordList;
  }

  /**
   * Breaks the words list into 128 words and returns
   * a list of promises
   * @param {Array} words - list of source words
   * @returns {Array} promises - array of promises
   */
  getPromises(words) {
    var i = 0,
      promises = [],
      url = '',
      limitedWords = [];

    this.url += '&lang=' + this.srcLang + '-' + this.targetLang;
    while (i < words.length) {
      url = this.url;
      limitedWords = words.slice(i, i + 500);
      for (let j in limitedWords) {
        url += '&text=' + limitedWords[j];
      }
      url = encodeURI(url);
      promises.push(http(url).get());
      i += 500;
    }

    return promises;
  }

  /**
   * Merge translations from all responses
   * @param {Array} responses - responses from all promises
   * @returns {Array} translations - combined responses
   */
  combineTranslations(responses) {
    var translations = [];
    for (let i in responses) {
      translations = translations.concat(JSON.parse(responses[i]).text);
    }
    return translations;
  }

  /**
   * Map source words to translations
   * @param {Array} translations - list of translated words
   * @param {Object} words - source words list
   * @returns {Object} tMap - translation map
   */
  mapTranslations(translations, words) {
    var tMap = {};
    for (let i in words) {
      // add a try catch block
      tMap[words[i]] = translations[i];
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
