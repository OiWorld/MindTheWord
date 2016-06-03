import { http } from '../utils/http'

export class BingTranslate {
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
    }
  }

  getTranslations(words) {
    var promise = new Promise((resolve, reject) => {
      var payload = this.formPayload(words);
      let headers = {'content-type': 'application/x-www-form-urlencoded'}
      http(this.authUrl)
        .post(this.authData, headers)
        .then((data) => {
          headers = {
            'Authorization': 'Bearer' + ' ' + JSON.parse(data).access_token,
            'content-type': 'application/xml'
          }
          http(this.url)
            .post(payload, headers)
            .then((res) => {
              let translations = this.filterTranslations(res),
                tMap = this.mapTranslations(translations, words);
              console.log(tMap);
              resolve(tMap)
            })
        })
    });
    return promise;
  }

  formPayload(words) {
    let payload = '<TranslateArrayRequest>'
                +   '<AppId></AppId>'
                +   '<From>' + this.srcLang + '</From>'
                +   '<Texts>'
    for (let word in words) {
      payload += '<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + word + '</string>'
    }

    payload += '</Texts>'
            +  '<To>' + this.targetLang + '</To>'
            +  '</TranslateArrayRequest>'

    return {'payload': payload, 'xml': true}
  }

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

  // http://stackoverflow.com/questions/7949752/cross-browser-javascript-xml-parsing
  parseXML(xmlStr) {
    return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
  }

  mapTranslations(translations, words) {
    var tMap = {},
      i = 0,
      translatedWords = translations;

    for (let word in words) {
      // add a try catch block
      tMap[word] = translatedWords[i]
      i++;
    }

    return tMap;
  }
}
