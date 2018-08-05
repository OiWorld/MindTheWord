import { YandexTranslate } from './yandexTranslate';
import { GoogleTranslate } from './googleTranslate';
import { BingTranslate } from './bingTranslate';
import { ResponsiveVoiceLanguages } from './responsiveVoiceLanguages';

export class ContextMenu {

  constructor() {}

  isWordCountNone(inputString) {
    var s = inputString;
    s = s.replace(/(^\s*)|(\s*$)/gi, '');
    s = s.replace(/[ ]{2,}/gi, ' ');
    s = s.replace(/\n /, '\n');
    if (s.split(' ').length !== 1) {
      alert('Please select a single word only. Phrases such as: "' + inputString + '" aren\'t allowed');
      return true;
    }
    return false;
  }

  searchForSimilarWords(selectedText, searchPlatform) {
    var searchPlatformURLS = {
      'bing': 'http://www.bing.com/search?q=%s+synonyms&go=&qs=n&sk=&sc=8-9&form=QBLH',
      'google': 'http://www.google.com/#q=%s+synonyms&fp=1',
      'googleImages': 'http://www.google.com/search?num=10&hl=en&site=imghp&tbm=isch&source=hp&q=%s',
      'thesaurus': 'http://www.thesaurus.com/browse/%s?s=t'
    };
    var searchUrl = searchPlatformURLS[searchPlatform];
    selectedText = selectedText.replace(' ', '+');
    searchUrl = searchUrl.replace(/%s/g, selectedText);
    chrome.tabs.create({
      'url': searchUrl
    });
  }

  speakTheWord() {
    chrome.storage.local.get(null, (data) => {
      var playbackOptions = JSON.parse(data.playbackOptions);
      var targetLanguage = data.targetLanguage;
      var utterance = data.utterance;
      var languageDifference = true;

      chrome.tts.getVoices((voices) => {
        voices.forEach((voice) => {
          // to search for current voice name and compare if the language supported by it is similar to the target language
          if (voice.voiceName == playbackOptions.voiceName && voice.lang.includes(targetLanguage))
            languageDifference = false;
        });
      });

      var options = {
        rate: parseFloat(playbackOptions.rate),
        pitch: parseFloat(playbackOptions.pitch),
        volume: parseFloat(playbackOptions.volume)
      };

      if (!languageDifference) { // if target language is same as the one supported by playback voice name
        options['voiceName'] = playbackOptions.voiceName;
        chrome.tts.speak(utterance, options);
      } else {
        var targetLanguageCode = ResponsiveVoiceLanguages[targetLanguage];
        if (targetLanguageCode != null) {
          chrome.storage.local.set({
            'targetLanguageCode': targetLanguageCode,
            'options': options
          });
          chrome.tabs.executeScript(null, {
            file: 'assets/js/responsivevoice.js'
          });
        } else {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'assets/img/128.png',
            title: 'Mind The Word',
            message: 'Pronunciation not available.'
          });
        }
      }

    });
  }

  translateSentence(selectedText, translatedWords) {
    var promise = new Promise((resolve, reject) => {
      var keys = ['translatorService',
        'sourceLanguage',
        'targetLanguage',
        'yandexTranslatorApiKey',
        'googleTranslatorApiKey',
        'bingTranslatorApiKey'
      ];
      var words = selectedText.split(' ');
      var translations = Object.values(translatedWords);
      var sourceWords = Object.keys(translatedWords);
      if (words.length >= 2 && words.length < 14) {
        for (var i in words) {
          if (translations.indexOf(words[i]) > -1) {
            words[i] = sourceWords[translations.indexOf(words[i])];
          }
        }
        selectedText = words.join(' ');
        chrome.storage.local.get(keys, (data) => {
          var promise = {};
          switch (data.translatorService) {
            case 'Yandex':
              let yandexTranslate = new YandexTranslate(data.yandexTranslatorApiKey, data.sourceLanguage, data.targetLanguage);
              promise = yandexTranslate.translateSentence(selectedText);
              break;
            case 'Bing':
              let bingTranslate = new BingTranslate(data.bingTranslatorApiKey, data.sourceLanguage, data.targetLanguage);
              promise = bingTranslate.translateSentence(selectedText);
              break;
            case 'Google':
              let googleTranslate = new GoogleTranslate(data.googleTranslatorApiKey, data.sourceLanguage, data.targetLanguage);
              promise = googleTranslate.translateSentence(selectedText);
              break;
            default:
          }
          promise
            .then((translatedSentence) => {
              resolve(translatedSentence);
            })
            .catch((e) => {
              reject(e);
            });
        });
      } else {
        alert('Select a sentence containing at least 3 words and at most 15 words.');
      }
    });
    return promise;
  }

}