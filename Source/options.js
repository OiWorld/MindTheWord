var storage = chrome.storage.local;
var cachedStorage = {};

// defaultStorage is used if the storage has not been initialized yet.
var defaultStorage = {
  initialized: true,
  activation: true,
  blacklist: '(stackoverflow.com|github.com|code.google.com|developer.*.com|duolingo.com)',
  savedPatterns: JSON.stringify([
    [
      ['en', 'English'],
      ['it', 'Italian'], '25', true
    ],
    [
      ['en', 'English'],
      ['la', 'Latin'], '15', false
    ]
  ]),
  sourceLanguage: 'en',
  targetLanguage: 'it',
  translatedWordStyle: 'font-style: inherit;\ncolor: rgba(255,153,0,1);\nbackground-color: rgba(256, 100, 50, 0);',
  userBlacklistedWords: '(this|that)',
  translationProbability: 15,
  minimumSourceWordLength: 3,
  ngramMin: 1,
  ngramMax: 1,
  userDefinedTranslations: '{"the":"the", "a":"a"}',
  limitToUserDefined: false,
  translatorService: 'Google Translate',
  yandexTranslatorApiKey: ''
};

function e(id) {
  return document.getElementById(id);
}

$(function() {
  var languageLoaded = function() {
    loadStorageAndUpdate(function(data) {
      initUi();
      updateUi(data);
    });
  };
  google.load('language', '1', {
    callback: languageLoaded
  });

  function setupListeners() {
    e('getKeyBtn').addEventListener('click', getKey);
    e('addTranslationBtn').addEventListener('click', createPattern);
    e('translatedWordStyle').addEventListener('keyup', showCSSExample);
    e('minimumSourceWordLength').addEventListener('blur', save_minimumSourceWordLength);
    e('ngramMin').addEventListener('blur', save_ngramMin);
    e('ngramMax').addEventListener('blur', save_ngramMax);
    e('translatedWordStyle').addEventListener('blur', save_translatedWordStyle);
    e('blacklist').addEventListener('blur', save_blacklist);
    e('userDefinedTranslations').addEventListener('blur', save_userDefinedTranslations);
    e('limitToUserDefined').addEventListener('click', save_limitToUserDefined);
    e('userBlacklistedWords').addEventListener('blur', save_userBlacklistedWords);
    e('yandexTranslatorApiKey').addEventListener('blur', save_yandexTranslatorApiKey);
    $('#translatorService').change(function(e) {
      setLanguages(e.currentTarget.value);
    });
  }

  function initUi() {
    console.log('initUi begin');
    setupListeners();
    console.log('initUi end');
  }

  var YandexLanguages = {
    Albanian: 'sq',
    Arabian: 'ar',
    Armenian: 'hy',
    Azeri: 'az',
    Belarusian: 'be',
    Bosnian: 'bs',
    Bulgarian: 'bg',
    Catalan: 'ca',
    Croatian: 'hr',
    Czech: 'cs',
    Chinese: 'zh',
    Danish: 'da',
    Dutch: 'nl',
    English: 'en',
    Estonian: 'et',
    Finnish: 'fi',
    French: 'fr',
    Georgian: 'ka',
    German: 'de',
    Greek: 'el',
    Hebrew: 'he',
    Hungarian: 'hu',
    Icelandic: 'is',
    Indonesian: 'id',
    Italian: 'it',
    Japanese: 'ja',
    Korean: 'ko',
    Latvian: 'lv',
    Lithuanian: 'lt',
    Macedonian: 'mk',
    Malay: 'ms',
    Maltese: 'mt',
    Norwegian: 'no',
    Polish: 'pl',
    Portuguese: 'pt',
    Romanian: 'ro',
    Russian: 'ru',
    Spanish: 'es',
    Serbian: 'sr',
    Slovak: 'sk',
    Slovenian: 'sl',
    Swedish: 'sv',
    Thai: 'th',
    Turkish: 'tr',
    Ukrainian: 'uk',
    Vietnamese: 'vi'
  };

  //Sets Languages
  function setLanguages(translatorService) {
    console.log('setLanguages begin');
    var languages = (translatorService === 'Yandex') ? YandexLanguages : google.language.Languages;
    var targetLanguageOptions = ' ';
    for (var language in languages) {
      var name = language.substring(0, 1) + language.substring(1).toLowerCase().replace('_', ' - ');
      targetLanguageOptions += '<option value="' + languages[language] + '">' + name + '</option>';
    }
    e('sourceLanguage').innerHTML = targetLanguageOptions;
    e('targetLanguage').innerHTML = targetLanguageOptions;
    console.log('setLanguages end');
  }

  function updateUi(data) {
    console.log('updateUI begin');
    restoreOptions(data);
    restorePatterns(data);
    setLanguages(data.translatorService);
    showCSSExample();

    console.log('updateUI end');
  }
  /***
   * Text: String, what you'd like it to say
   * Duration: int, how long before it disappears
   * Fade: int, how long before it'd completely hidden (I'd recommend this to be lower than duration time)
   * Type: "success", "error", ...
   */
  function status(text, duration, fade, type) {
    (function(text, duration, fade) {
      var status = document.createElement('div');
      status.className = 'alert alert-' + type;
      status.innerText = text;
      e('status').appendChild(status);

      setTimeout(function() {
        var opacity = 1,
          ntrvl = setInterval(function() {
            if (opacity <= 0.01) {
              clearInterval(ntrvl);
              e('status').removeChild(status);
            }
            status.style.opacity = opacity;
            opacity -= (1 / fade);
          }, 1);
      }, (duration - fade));
      console.log(text);
    })(text, duration, fade);
  }

  function statusDefault(text) {
    status(text, 1500, 100, 'success');
  }

  function showCSSExample() {
    var oldNum;
    if (!oldNum) {
      oldNum = 0;
    }
    var synonyms = ['awesome', 'magnificent', 'fabulous', 'impressive', 'great',
        'beautiful', 'amazing', 'awe-inspiring', 'astonishing', 'astounding',
        'noble', 'formidable', 'heroic', 'spectacular', 'important-looking',
        'majestic', 'dazzling', 'splendid', 'brilliant', 'glorious'
      ],
      num = Math.floor(Math.random() * synonyms.length);
    while (num == oldNum) {
      num = Math.floor(Math.random() * synonyms.length);
    } // We should not use the same word again. Now, should we?
    oldNum = num;
    e('resultSpan').style.cssText = e('translatedWordStyle').value;
    e('resultSpan').innerText = synonyms[num];
  }

  function getKey() {
    console.log('getKey pressed');
    window.open('https://tech.yandex.com/keys/get/?service=trnsl', '_self');
  }

  function createPattern() {
    console.log('createPattern begin');
    var patterns = JSON.parse(S('savedPatterns')),
      src = [],
      trg = [],
      prb = [];

    console.debug(S('savedPatterns'));
    var translator = document.getElementById('translatorService');
    var service = translator.children[translator.selectedIndex].value;
    src[0] = document.getElementById('sourceLanguage');
    src[1] = src[0].children[src[0].selectedIndex].value;
    src[2] = src[0].children[src[0].selectedIndex].text;
    trg[0] = document.getElementById('targetLanguage');
    trg[1] = trg[0].children[trg[0].selectedIndex].value;
    trg[2] = trg[0].children[trg[0].selectedIndex].text;
    prb[0] = document.getElementById('translationProbability');
    prb[1] = prb[0].children[prb[0].selectedIndex].value;

    var duplicateInput = false; //to check duplicate patterns
    for (var index in patterns) {
      if (patterns[index][0][0] === src[1] && patterns[index][1][0] === trg[1] && patterns[index][2] === prb[1]) {
        duplicateInput = true;
        status('Pattern already exists', 9000, 600, 'error');
      }
    }

    if (duplicateInput === false) {
      patterns.push([
        [src[1], src[2]],
        [trg[1], trg[2]],
        prb[1],
        false,
        service
      ]);
    }

    saveBulk({
      'savedPatterns': JSON.stringify(patterns)
    }, 'Saved Pattern');
    console.log('createPattern end');
  }

  function restorePatterns(data) {
    console.log('restorePatterns begin');
    e('savedTranslationPatterns').innerHTML = '';
    console.log(data.savedPatterns);
    var patterns = null;
    try {
      patterns = JSON.parse(data.savedPatterns);
    }
    // The following three lines of code should not be necessary,
    // because loadStorageAndUpdate already takes care of the cases
    // when the storage is null, and hence "data" should always be non-null
    // however, many users have been experiencing an unexplained bug (issue # 39)
    // which is causing the var "patterns" to be "undefined".
    // the following three lines of code aim to increase robustness,
    // until this bug is properly solved.
    catch (e) {
      console.debug('this should never happen');
      console.debug(e);
      patterns = defaultStorage;
    }

    console.log('savedPatterns: ' + patterns);
    var patternsElem = $('#savedTranslationPatterns').html('');

    // DeleteButton should only be shown if there are two or more patterns
    var deleteButton = '';
    if (patterns.length > 1) {
      deleteButton = '<button class=\'btn btn-danger pull-right deletePattern\'>Delete</button>';
    }
    $.each(patterns, function(i, pattern) {
      var listElem = $('<p class=\'alert alert-' + ((pattern[3] && !!data.activation) ? 'success' : 'nothing') + ' tPattern\'> \
            Use ' + ((pattern[4] === 'Yandex') ? 'Yandex ' : 'Google ') + '\
            to translate \
            <span class=\'label label-info\'>' + pattern[2] + '%</span> \
            of all \
            <span class=\'label label-info\'>' + pattern[0][1] + '</span> \
            words into \
            <span class=\'label label-info\'>' + pattern[1][1] + '</span> \
            ' + deleteButton + ' \
            <input type=\'hidden\' value=\'' + i + '\' />\
            </p>');
      listElem.click(function() {
        activatePattern(i, patterns);
      });
      listElem.find('.deletePattern').click(function(e) {
        deletePattern(i, patterns, e);
      });
      patternsElem.append(listElem);
    });

    var nonElem = $('<p class=\'alert alert-' + ((!data.activation) ? 'success' : 'nothing') + ' tPattern\'> \
      Do not translate \
      <input type=\'hidden\' value=\'-1\' \
      </p>');
    nonElem.click(function() {
      activatePattern(-1, patterns);
    });
    patternsElem.append(nonElem);
    console.log('restorePatterns end');
  }

  function deletePattern(index, patterns, e) {
    e.stopPropagation();
    var _id = index,
      moveTrue = false; // Are you deleting the active pattern?

    if (patterns.length > 1) {
      if (patterns[_id][3]) {
        moveTrue = true;
      }
      patterns.splice(_id, 1);
      if (moveTrue) {
        patterns[0][3] = true;
        activatePattern(0, patterns);
      } else {
        saveBulk({
          'savedPatterns': JSON.stringify(patterns)
        }, 'Deleted Pattern');
      }
    }
  }

  function activatePattern(index, patterns) {
    var _id = index;
    var message = 'Pattern Activated.';
    var toSave = {};
    if (_id == -1) {
      toSave.activation = false;
    } else {
      toSave.activation = true;

      var selectedPattern = patterns[_id];

      toSave.sourceLanguage = selectedPattern[0][0];
      toSave.targetLanguage = selectedPattern[1][0];
      toSave.translationProbability = selectedPattern[2];
      toSave.translatorService = selectedPattern[4] || 'Google Translate';

      if (toSave.translatorService === 'Yandex') {
        message += ' Make sure you have setup Yandex Api key';
      }
    }

    for (var i in patterns) {
      patterns[i][3] = (i == _id ? true : false);
    }
    toSave.savedPatterns = JSON.stringify(patterns);
    saveBulk(toSave, message);
  }

  function restoreOptions(data) {
    var options = ['sourceLanguage', 'targetLanguage', 'translationProbability',
      'minimumSourceWordLength', 'ngramMin', 'ngramMax',
      'translatedWordStyle', 'blacklist',
      'userDefinedTranslations', 'userBlacklistedWords', 'translatorService', 'yandexTranslatorApiKey', 'limitToUserDefined'
    ];

    for (var index in options) {
      restore(options[index], data);
    }
  }

  function restore(option, data) {
    var elem = e(option);
    //for checkbox this returns input
    var type = elem.tagName.toLowerCase();

    console.debug('Restore ' + option + ' to: ' + data[option]);

    if (type == 'select') {
      for (var i = 0; i < elem.children.length; i++) {
        var child = elem.children[i];
        if (child.value == data[option]) {
          child.selected = 'true';
          break;
        }
      }
    }
    //Restores the options for limitToUserDefinedTranslations
    else if (elem.type.toLowerCase() == 'checkbox') {
      if (data[option]) {
        elem.checked = true;
      } else {
        elem.checked = false;
      }
    } else {
      elem.value = data[option];
    }
  }

  /** Storage **/
  function S(key) {
    return cachedStorage[key];
  }

  function loadStorageAndUpdate(callback) {
    storage.get(null, function(data) {
      console.log('data: ' + data + ' : ' + JSON.stringify(data));
      var d = {};
      /*
      * In this case, we have to check for storage not initialized
      * as well as check if the object data has fields other than
      * activation or not.
      **/
      if (!data || JSON.stringify(data) == '{}' || !data.savedPatterns) {
        console.log('setting storage to defaultStorage (stringified): ');
        console.log(JSON.stringify(defaultStorage));
        storage.set(defaultStorage);
        d = defaultStorage;
      } else {
        d = data;
      }

      cachedStorage = d;
      if (!!callback) {
        callback(d);
      }
    });
  }

  function saveBulk(data, message) {
    storage.set(data, function() {
      statusDefault(message);
      loadStorageAndUpdate(function(data) {
        updateUi(data);
      });
    });
  }

  function save(id, message) {
    var elem = e(id);

    var v;
    if (elem.tagName.toLowerCase() == 'select') {
      v = elem.children[elem.selectedIndex].value;
    } else if (elem.type.toLowerCase() == 'checkbox') {
      v = elem.checked;
    } else {
      v = elem.value;
    }
    console.log('Saving ' + id + ' as ' + v);
    if (cachedStorage[id] != v) {
      var map = {};
      map[id] = v;
      saveBulk(map, message);
    }
  }

  // Save to localStorage.
  function save_userDefinedTranslations() {
    try {
      JSON.parse(e('userDefinedTranslations').value);
      save('userDefinedTranslations', 'User-defined translations saved');
    } catch (e) {
      console.debug(S('userDefinedTranslations'));
      status('Your user-defined translations are badly specified and therefore will not be used. \
          Please provide your user-defined translations according to the following format: \
          \n\n {"word1":"translation1", "word2":"translation2", "word3":"translation3", "word4":"translation4"}', 9000, 600, 'error');
    }
  }

  function save_limitToUserDefined() {
    // ToDo: Implement validation
    save('limitToUserDefined', 'Limit to user defined saved');
  }

  function save_minimumSourceWordLength() {
    // ToDo: Implement validation
    save('minimumSourceWordLength', 'Minimum word length saved');
  }

  function save_translatedWordStyle() {
    // ToDo: Implement validation
    save('translatedWordStyle', 'Translated word style saved');
  }

  function save_blacklist() {
    // ToDo: Implement validation
    save('blacklist', 'Blacklist saved');
  }

  function save_userBlacklistedWords() {
    // ToDo: Implement validation
    save('userBlacklistedWords', 'Blacklisted words saved');
  }

  function save_yandexTranslatorApiKey() {
    save('yandexTranslatorApiKey', 'Yandex Api Key Updated.');
  }

  function save_ngramMin() {
    save('ngramMin', 'Minimum word sequence length saved');
  }

  function save_ngramMax() {
    save('ngramMax', 'Maximum word sequence length saved');
  }

  // ToDo: Move the blacklist listener to background.js (find better solution)

  // "Options.js" will only be executed when the user opens the options page.
  // Therefore, it seems that until the user opens the options page, the messages
  // sent in line 220 of "background.js" will not be handled

  // Moving this functionality into "background.js" as it will lead to duplication of code
  // as the entire functionality of saveBulk from "option.js" will have to be implemented again

  // Listener to update blacklist from context menu
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.updateBlacklist) {
      tabURL = request.tabURL;
      chrome.storage.local.get('blacklist', function(result) {

        currentBlacklist = result.blacklist;
        blacklistURLs = [];
        blacklistURLs = currentBlacklist.slice(1, -1).split('|');

        re = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;
        domainNameFromTabURL = tabURL.match(re)[0];

        //to avoid duplication
        if (blacklistURLs.indexOf(domainNameFromTabURL + '*') == -1) {

          //incase of empty current black list
          if (!currentBlacklist) {
            updatedBlacklist = '(' + currentBlacklist.split(')')[0] + domainNameFromTabURL + '*)';
          } else {
            updatedBlacklist = currentBlacklist.split(')')[0] + '|' + domainNameFromTabURL + '*)';
          }

          id = 'blacklist';
          if (cachedStorage[id] != updatedBlacklist) {
            var map = {};
            map[id] = updatedBlacklist;
            saveBulk(map, 'Blacklist saved');
          }
        }
      });
    }

    else if (request.updateUserBlacklistedWords) {
      chrome.storage.local.get('userBlacklistedWords', function(result) {
        currentUserBlacklistedWords = result.userBlacklistedWords;
        blacklistedWords = [];
        blacklistedWords =  currentUserBlacklistedWords.slice(1,-1).split('|');

        wordToBeBlacklisted = request.word;

        //to avoid duplication
        if (blacklistedWords.indexOf(wordToBeBlacklisted) == -1) {

          //incase of empty current black list
          if (!currentUserBlacklistedWords) {
            updatedBlacklistedWords = '(' +  wordToBeBlacklisted + ')';
          } else {
            updatedBlacklistedWords = currentUserBlacklistedWords.split(')')[0] + '|' + wordToBeBlacklisted + ')';
          }

          id = 'userBlacklistedWords';
          if (cachedStorage[id] != updatedBlacklistedWords) {
            var map = {};
            map[id] = updatedBlacklistedWords;
            saveBulk(map, 'Blacklist saved');
          }
        }
      });
    }
  });

  google_analytics('UA-1471148-14');
});
