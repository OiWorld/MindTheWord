import { http } from '../utils/http';

/** Class for Google Translate */
export class GoogleTranslate {
  /**
   * Initialize options and credentials
   * @constructor
   * @param {Object} key - Google API key
   * @param {string} srcLang - source languages
   * @param {string} targetLang - target language
   */
  constructor(key, srcLang, targetLang) {
    this.key = key;
    this.srcLang = srcLang;
    this.targetLang = targetLang;
    this.url = 'https://www.googleapis.com/language/translate/v2?key=' + this.key;
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

    while (i < words.length) {
      url = this.url;
      limitedWords = words.slice(i, i + 128);
      for (let j in limitedWords) {
        url += '&q=' + limitedWords[j];
      }
      url = encodeURI(url);
      promises.push(http(url).get());
      i += 128;
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
      translations = translations.concat(JSON.parse(responses[i]).data.translations);
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

  /**
   * Translate an entire input sentence
   * @param {string} text - sentence
   * @returns {Promise} promise - gives translated sentence on resolution
   */
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
