import { http } from '../utils/http';

/** Class for Free Translate */
export class FreeTranslate {

  /**
   * Initialize options and credentials
   * @constructor
   * @param {string} srcLang - source languages
   * @param {string} targetLang - target language
   */
  constructor(srcLang, targetLang) {
    // check key
    this.srcLang = srcLang;
    this.targetLang = targetLang;
    this.url = 'https://translate.googleapis.com/translate_a/single?client=gtx';
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
          let tMap = this.mapTranslations(words,responses);
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
    var buff = '';
    for (let word in words) {
      try{
        buff = encodeURI(word); // checks if the word can be sent for translations
        wordList.push(word);
      }catch(e){
        ;
      } 
    }
    return wordList;
  }


  /**
   * Breaks the words list into 128 words and returns
   * a list of promises
   * Maximum characters allowed per request is 4000
   * @param {Array} words - list of source words
   * @returns {Array} promises - array of promises
   */
  getPromises(words) {
    var i = 0,
      promises = [],
      url = '';

    this.url += '&sl=' + this.srcLang + '&tl=' + this.targetLang + '&dt=t&q=';
    while (i < words.length) {
      url = this.url;
      url += words[i];
      i+=1;
      url = encodeURI(url);
      promises.push(http(url).get());
    }

    return promises;
  }

  /**
   * Map source words to translations
   * @param {Array} translations - list of translated words
   * @param {Object} words - source words list
   * @returns {Object} tMap - translation map
   */
  mapTranslations(words,responses) {
    var i = 0,
      tMap = {},
      parsed_value;

    for (var i = 0; i < responses.length; i++) {
      parsed_value = JSON.parse(responses[i])[0][0];
      tMap[words[i]] = parsed_value[0];
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
