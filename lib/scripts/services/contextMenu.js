import { YandexTranslate } from './yandexTranslate'
import { GoogleTranslate } from './googleTranslate'
import { BingTranslate } from './bingTranslate'

export class ContextMenu {

  constructor() {}

  isWordCountNone(inputString) {
    var s = inputString;
    s = s.replace(/(^\s*)|(\s*$)/gi, "");
    s = s.replace(/[ ]{2,}/gi, " ");
    s = s.replace(/\n /, "\n");
    if (s.split(' ').length != 1) {
      alert('Please select a single word only. Phrases such as: "' + inputString + '" aren\'t allowed');
      return true;
    }
    return false;
  }

  searchForSimilarWords(selectedText, searchPlatform, tabURL) {
    var searchPlatformURLS = {
      'bing': 'http://www.bing.com/search?q=%s+synonyms&go=&qs=n&sk=&sc=8-9&form=QBLH',
      'google': 'http://www.google.com/#q=%s+synonyms&fp=1',
      'googleImages': 'http://www.google.com/search?num=10&hl=en&site=imghp&tbm=isch&source=hp&q=%s',
      'thesaurus': 'http://www.thesaurus.com/browse/%s?s=t'
    }
    var searchUrl = searchPlatformURLS[searchPlatform];
    selectedText = selectedText.replace(" ", "+");
    searchUrl = searchUrl.replace(/%s/g, selectedText);
    chrome.tabs.create({
      "url": searchUrl
    });
  }

  searchForWordUsageExamples(selectedText, searchPlatform, tabURL) {
    var searchPlatformURLS = {
      'yourdictionary.com': 'http://sentence.yourdictionary.com/%s',
      'use-in-a-sentence.com': 'http://www.use-in-a-sentence.com/english-words/10000-words/%s.htm',
      'manythings.org': 'http://www.manythings.org/sentences/words/%s/1.html'
    }
    var searchUrl = searchPlatformURLS[searchPlatform];
    selectedText = selectedText.replace(" ", "+");
    searchUrl = searchUrl.replace(/%s/g, selectedText);
    chrome.tabs.create({
      "url": searchUrl
    });
  }

  addUrlToBlacklist(tabURL) {
    var updatedBlacklist;
    chrome.storage.local.get('blacklist', function(result) {
      var currentBlacklist = result.blacklist;
      var blacklistURLs = [];
      blacklistURLs = currentBlacklist.slice(1, -1).split('|');
      var re = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;
      var domainNameFromTabURL = tabURL.match(re)[0];
      //to avoid duplication
      updatedBlacklist = '';
      if (blacklistURLs.indexOf(domainNameFromTabURL + '*') == -1) {
        //incase of empty current black list
        if (!currentBlacklist) {
          updatedBlacklist = '(' + domainNameFromTabURL + '*)';
        } else {
          updatedBlacklist = currentBlacklist.split(')')[0] + '|' + domainNameFromTabURL + '*)';
        }
      }
      chrome.storage.local.set({
        'blacklist': updatedBlacklist
      });
    });
  }

  addWordToBlacklist(wordToBeBlacklisted, tabURL) {

    if (this.isWordCountNone(wordToBeBlacklisted)) {
      return;
    }

    chrome.storage.local.get('userBlacklistedWords', function(result) {
      var currentUserBlacklistedWords = result.userBlacklistedWords;
      var blacklistedWords = [];
      blacklistedWords = currentUserBlacklistedWords.slice(1, -1).split('|');
      var updatedBlacklistedWords = '';
      //to avoid duplication
      if (blacklistedWords.indexOf(wordToBeBlacklisted) == -1) {
        //incase of empty current black list
        if (!currentUserBlacklistedWords) {
          updatedBlacklistedWords = '(' + wordToBeBlacklisted + ')';
        } else {
          updatedBlacklistedWords = currentUserBlacklistedWords.split(')')[0] + '|' + wordToBeBlacklisted + ')';
        }
      }
      chrome.storage.local.set({
        'userBlacklistedWords': updatedBlacklistedWords
      });
    });
  }

  speakTheWord(utterance, tabURL) {
    chrome.storage.local.get(null, (data) => {
      var playbackOptions = JSON.parse(data.playbackOptions);
      chrome.tts.speak(utterance, {
        voiceName: playbackOptions.voiceName,
        rate: parseFloat(playbackOptions.rate),
        pitch: parseFloat(playbackOptions.pitch),
        volume: parseFloat(playbackOptions.volume),
      });
    });
  }

  addToDifficultyBucket(word, difficultyLevel, translatedWords, tabURL) {

    if (this.isWordCountNone(word)) {
      return;
    }

    //to check if the selected word is one of the translated words
    var isTranslatedWord = false;
    for (var k in translatedWords) {
      if (translatedWords[k] === word) {
        isTranslatedWord = true;
        break;
      }
    }

    if (isTranslatedWord) {

      // Hash storage format:
      // format: {targetLanguage: {word1: E/N/H, word2: E/N/H}}
      // E -> easy, N -> normal, H -> hard

      chrome.storage.local.get(['difficultyBuckets', 'targetLanguage'], function(result) {
        if (result.targetLanguage) {
          var currentBuckets = JSON.parse(result.difficultyBuckets);
          var targetLang = result.targetLanguage;
          var targetLangWordBucket = currentBuckets[targetLang];
          var updatedBuckets = currentBuckets;
          if (targetLangWordBucket) {
            targetLangWordBucket[word] = difficultyLevel;
          } else {
            targetLangWordBucket = {}
            targetLangWordBucket[word] = difficultyLevel;
          }
          updatedBuckets[targetLang] = targetLangWordBucket;
          chrome.storage.local.set({
            'difficultyBuckets': JSON.stringify(updatedBuckets)
          });
        }
      });
    } else {
      alert('Select one of the translated words');
    }
  }

  markWordAsLearnt(word, translatedWords, tabURL) {
    if (this.isWordCountNone(word)) {
      return;
    }

    //to check if the selected word is one of the translated words
    var isTranslatedWord = false;
    for (var k in translatedWords) {
      if (translatedWords[k] === word) {
        isTranslatedWord = true;
        break;
      }
    }

    if (isTranslatedWord) {
      chrome.storage.local.get(['learntWords'], function(result) {
        var learntWords = result.learntWords;
        var updatedLearntWords = learntWords;
        if (learntWords.length == 2) {
          updatedLearntWords = "(" + word + ")";
        } else {
          updatedLearntWords = updatedLearntWords.split(")")[0] + "|" + word + ")";
        }
        chrome.storage.local.set({
          'learntWords': updatedLearntWords
        });
      });
    } else {
      alert('Select one of the translated words');
    }

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
            words[i] = sourceWords[translations.indexOf(words[i])]
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
              let bingTranslate = new GoogleTranslate(data.bingTranslatorApiKey, data.sourceLanguage, data.targetLanguage)
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
        alert('Select a sentence containing at least 3 words and at most 15 words.')
      }
    });
    return promise;
  }

}
