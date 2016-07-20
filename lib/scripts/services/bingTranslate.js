import { http } from '../utils/http';

/** Class for Bing translate feature */
export class BingTranslate {
  /**
   * Initialize options and credentials
   * @constructor
   * @param {Object} key - client_id and client_secret
   * @param {string} srcLang - source languages
   * @param {string} targetLang - target language
   */
  constructor(key, srcLang, targetLang) {
    this.srcLang = srcLang;
    this.targetLang = targetLang;
    this.url = 'https://api.microsofttranslator.com/V2/Http.svc/TranslateArray';
    this.authUrl = 'https://datamarket.accesscontrol.windows.net/v2/OAuth2-13';
    this.authData = {
      grant_type: 'client_credentials',
      scope: 'http://api.microsofttranslator.com',
      client_id: key.clientId,
      client_secret: key.clientSecret
    };
  }

  /**
   * Obtains auth token, posts a request for translations
   * and returns a promise.
   * @param {Object} - list of words
   * @returns {Promise} - On resolution gives the response
   */
  getTranslations(words) {
    var promise = new Promise((resolve, reject) => {
      var payload = this.formPayload(words);
      let headers = {'content-type': 'application/x-www-form-urlencoded'};
      http(this.authUrl)
        .post(this.authData, headers)
        .then((data) => {
          headers = {
            'Authorization': 'Bearer' + ' ' + JSON.parse(data).access_token,
            'content-type': 'application/xml'
          };
          http(this.url)
            .post(payload, headers)
            .then((res) => {
              let translations = this.filterTranslations(res),
                tMap = this.mapTranslations(translations, words);
              resolve(tMap);
            })
            .catch((e) => {
              reject(e);
            });
        })
        .catch((e) => {
          reject(e);
        });
    });
    return promise;
  }

  /**
   * Creates the XML payload for Bing
   * @param {Object} words - words list
   * @returns {Object} POST payload object
   */
  formPayload(words) {
    let payload = '<TranslateArrayRequest>'
                +   '<AppId></AppId>'
                +   '<From>' + this.srcLang + '</From>'
                +   '<Texts>';
    for (let word in words) {
      payload += '<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + word + '</string>';
    }

    payload += '</Texts>'
            +  '<To>' + this.targetLang + '</To>'
            +  '</TranslateArrayRequest>';

    return {'payload': payload, 'xml': true};
  }

  /**
   * Returns an array of translations which is in order
   * with the source words
   * @param {string} res - response from Bing
   * @param {Object} words - word list
   * @returns {Array} translations - list of translated words
   */
  filterTranslations(res, words) {
    // parse XML response to find response string and convert to lowercase
    let xmlDoc = this.parseXML(res),
      elements = xmlDoc.getElementsByTagName('TranslatedText'),
      translations = [];

    for (var i in elements) {
      translations.push(elements[i].innerHTML);
    }

    return translations;
  }

  /**
   * Parse string into XML
   * Referred: http://stackoverflow.com/questions/7949752/cross-browser-javascript-xml-parsing
   * @param {string} xmlStr - XML response
   * @returns {Object} parsed XML
   */
  parseXML(xmlStr) {
    return (new window.DOMParser()).parseFromString(xmlStr, 'text/xml');
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
      this.url = 'http://api.microsofttranslator.com/V2/Http.svc/Translate';
      this.url += '?appId';
      this.url += '&from=' + this.srcLang;
      this.url += '&to=' + this.targetLang;
      this.url += '&text=' + text;
      let headers = {'content-type': 'application/x-www-form-urlencoded'};
      http(this.authUrl)
        .post(this.authData, headers)
        .then((data) => {
          headers = {
            'Authorization': 'Bearer' + ' ' + JSON.parse(data).access_token
          };
          http(this.url)
            .get({}, headers)
            .then((res) => {
              let xml = this.parseXML(res);
              let sentence = xml.getElementsByTagName('string')[0].innerHTML;
              resolve(sentence);
            })
            .catch((e) => {
              reject(e);
            });
        });
    });
    return promise;
  }
}
