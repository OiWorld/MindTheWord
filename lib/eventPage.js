!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in g||(g[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==m.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=g[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(m.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=g[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return D[e]||(D[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},r.name);t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=g[s],f=D[s];f?l=f.exports:c&&!c.declarative?l=c.esModule:c?(d(c),f=c.module,l=f.exports):l=v(s),f&&f.importers?(f.importers.push(t),t.dependencies.push(f)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=g[e];if(t)t.declarative?p(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=v(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=g[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(e){var r={};if("object"==typeof e||"function"==typeof e){var t=e&&e.hasOwnProperty;if(h)for(var n in e)f(r,e,n)||c(r,e,n,t);else for(var n in e)c(r,e,n,t)}return r["default"]=e,y(r,"__useDefault",{value:!0}),r}function c(e,r,t,n){(!n||r.hasOwnProperty(t))&&(e[t]=r[t])}function f(e,r,t){try{var n;return(n=Object.getOwnPropertyDescriptor(r,t))&&y(e,t,n),!0}catch(o){return!1}}function p(r,t){var n=g[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==m.call(t,u)&&(g[u]?p(u,t):v(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function v(e){if(I[e])return I[e];if("@node/"==e.substr(0,6))return _(e.substr(6));var r=g[e];if(!r)throw"Module "+e+" not present.";return a(e),p(e,[]),g[e]=void 0,r.declarative&&y(r.module.exports,"__esModule",{value:!0}),I[e]=r.declarative?r.module.exports:r.esModule}var g={},m=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},h=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(x){h=!1}var y;!function(){try{Object.defineProperty({},"a",{})&&(y=Object.defineProperty)}catch(e){y=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var D={},_="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,I={"@empty":{}};return function(e,n,o){return function(a){a(function(a){for(var u={_nodeRequire:_,register:r,registerDynamic:t,get:v,set:function(e,r){I[e]=r},newModule:function(e){return e}},d=0;d<n.length;d++)(function(e,r){r&&r.__esModule?I[e]=r:I[e]=s(r)})(n[d],arguments[d]);o(u);var i=v(e[0]);if(e.length>1)for(var d=1;d<e.length;d++)v(e[d]);return i.__useDefault?i["default"]:i})}}}("undefined"!=typeof self?self:global)

(["1"], [], function($__System) {
var require = this.require, exports = this.exports, module = this.module;
$__System.registerDynamic("2", ["3"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $ = $__require('3');
  module.exports = function create(P, D) {
    return $.create(P, D);
  };
  return module.exports;
});

$__System.registerDynamic("4", ["2"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = {
    "default": $__require('2'),
    __esModule: true
  };
  return module.exports;
});

$__System.registerDynamic("3", [], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $Object = Object;
  module.exports = {
    create: $Object.create,
    getProto: $Object.getPrototypeOf,
    isEnum: {}.propertyIsEnumerable,
    getDesc: $Object.getOwnPropertyDescriptor,
    setDesc: $Object.defineProperty,
    setDescs: $Object.defineProperties,
    getKeys: $Object.keys,
    getNames: $Object.getOwnPropertyNames,
    getSymbols: $Object.getOwnPropertySymbols,
    each: [].forEach
  };
  return module.exports;
});

$__System.registerDynamic("5", ["3"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  var $ = $__require('3');
  module.exports = function defineProperty(it, key, desc) {
    return $.setDesc(it, key, desc);
  };
  return module.exports;
});

$__System.registerDynamic("6", ["5"], true, function($__require, exports, module) {
  ;
  var define,
      global = this,
      GLOBAL = this;
  module.exports = {
    "default": $__require('5'),
    __esModule: true
  };
  return module.exports;
});

$__System.registerDynamic("7", ["6"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var _Object$defineProperty = $__require('6')["default"];
  exports["default"] = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        _Object$defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();
  exports.__esModule = true;
  return module.exports;
});

$__System.registerDynamic("8", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  exports["default"] = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  exports.__esModule = true;
  return module.exports;
});

$__System.register("9", ["7", "8"], function (_export) {
  var _createClass, _classCallCheck, BingTranslate;

  return {
    setters: [function (_) {
      _createClass = _["default"];
    }, function (_2) {
      _classCallCheck = _2["default"];
    }],
    execute: function () {
      "use strict";

      BingTranslate = (function () {
        function BingTranslate() {
          _classCallCheck(this, BingTranslate);
        }

        _createClass(BingTranslate, [{
          key: "translate",

          // intitialize Secret Key
          value: function translate() {}
        }, {
          key: "updateKey",
          value: function updateKey() {}
        }, {
          key: "removeKey",
          value: function removeKey() {}
        }]);

        return BingTranslate;
      })();

      _export("BingTranslate", BingTranslate);
    }
  };
});

$__System.register('1', ['4', '9'], function (_export) {
  var _Object$create, BingTranslate, storage, currentTranslatedMap, translator, googleTranslator, yandexTranslator, TranslatorFactory, ConcreteTranslatorFactory;

  //sets up default data in localStorage
  function setupDefaultData() {
    console.log('Initializing Local Storage');
    var localData = {
      initialized: true,
      activation: true,
      blacklist: '(stackoverflow.com|github.com|code.google.com|developer.*.com|duolingo.com)',
      savedPatterns: JSON.stringify([[['en', 'English'], ['it', 'Italian'], '25', true, 'Yandex'], [['en', 'English'], ['de', 'German'], '15', false, 'Yandex']]),
      sourceLanguage: 'en',
      targetLanguage: 'it',
      translatedWordStyle: 'font-style: inherit;\ncolor: rgba(255,153,0,1);\nbackground-color: rgba(256, 100, 50, 0);',
      userBlacklistedWords: '(this|that)',
      translationProbability: 15,
      minimumSourceWordLength: 3,
      ngramMin: 1,
      ngramMax: 1,
      userDefinedTranslations: '{"the":"the", "a":"a"}',
      translatorService: 'Yandex',
      yandexTranslatorApiKey: ''
    };
    chrome.storage.local.set(localData);
  }

  //On first installation, load default Data and initialize context menu

  function translateOneRequestPerFewWords(words, prefs, callback) {
    //console.debug("words: " + JSON.stringify(words));
    var concatWords = '';
    var length = 0;
    var maxLength = 800;
    var concatWordsArray = {};
    var cWALength = 1;

    for (var word in words) {
      //console.debug("word: " + word);
      concatWords += word + '. ';
      //console.debug("concatWords: " + concatWords);
      concatWordsArray[cWALength] = concatWords;
      length += encodeURIComponent(word + '. ').length;

      if (length > maxLength) {
        cWALength++;
        concatWords = '';
        length = 0;
      }
    }
    var tMap = {};
    translateORPFWRec(concatWordsArray, 1, cWALength, tMap, prefs, callback);
  }

  function getData(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        callback(JSON.parse(xhr.responseText));
      }
    };
    xhr.send();
  }

  function translateORPFWRec(concatWordsArray, index, length, tMap, prefs, callback) {
    console.log('translateORPFWRec');
    console.debug('concatWordsArray: ' + JSON.stringify(concatWordsArray));
    console.debug('index: ' + index + '; length: ' + length);
    if (index > length) callback(tMap);else {
      new new ConcreteTranslatorFactory().getTranslator(prefs.translatorService).translate(prefs, concatWordsArray[index], function (pMap) {
        for (var key in pMap) {
          if (pMap.hasOwnProperty(key)) {
            tMap[key] = pMap[key];
          }
        }
        translateORPFWRec(concatWordsArray, index + 1, length, tMap, prefs, callback);
      });
    }
  }

  function onMessage(request, sender, sendResponse) {
    console.log('onMessage ');
    console.log(request);
    if (request.wordsToBeTranslated) {
      console.log('words to be translated:', request.wordsToBeTranslated);
      storage.get(null, function (prefs) {
        translateOneRequestPerFewWords(request.wordsToBeTranslated, prefs, function (tMap) {
          currentTranslatedMap = tMap;
          console.log('translations:', tMap);
          sendResponse({
            translationMap: tMap
          });
        });
      });
    } else if (request.getOptions) {
      storage.get(null, function (data) {
        data.script = [chrome.extension.getURL('/assets/js/mtw.js')];
        console.log('sending getOptions data');
        console.log(data);
        sendResponse(data);
      });
    } else if (request.runMindTheWord) {
      chrome.tabs.onUpdated.addListener(function (tabId, info) {
        //Wait until page has finished loading
        if (info.status == 'complete') {
          console.log(info.status);
          sendResponse(true);
        }
      });
    }
    return true;
  }

  function browserActionClicked() {
    chrome.tabs.create({
      url: chrome.extension.getURL('options.html')
    });
  }

  // sends current URL to be added to the blacklist
  function onClickHandler(info, tab) {
    if (info.menuItemId == "blacklistWebsite") {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.runtime.sendMessage({ updateBlacklist: 'Add website to blacklist', tabURL: tabs[0].url }, function (r) {});
      });
    } else if (info.menuItemId == "blacklistWord") {
      selectedText = info.selectionText;

      if (selectedText.indexOf(' ') < 0) {
        chrome.runtime.sendMessage({ updateUserBlacklistedWords: 'Add words to blacklist', word: selectedText }, function (r) {});
      } else {
        alert('Please select only a single word. "' + selectedText + '" is not allowed.');
      }
    } else if (info.menuItemId === "saveWord") {
      selectedText = info.selectionText;
      var translation = currentTranslatedMap[selectedText];
      if (currentTranslatedMap[selectedText]) {
        console.log('To save:' + selectedText);
        chrome.runtime.sendMessage({ updateUserDictionary: 'Add word to dictionary', word: selectedText, translation: translation }, function (r) {});
      } else {
        alert('Please select translated word. "' + selectedText + '" is not translated.');
      }
    }
  }

  // google_analytics('UA-1471148-13');
  return {
    setters: [function (_) {
      _Object$create = _['default'];
    }, function (_2) {
      BingTranslate = _2.BingTranslate;
    }],
    execute: function () {
      'use strict';

      console.log('eventPage running');chrome.runtime.onInstalled.addListener(function () {
        setupDefaultData();
        chrome.contextMenus.create({
          'title': 'MindTheWord',
          'id': 'parent',
          'contexts': ['selection', 'page']
        });
        chrome.contextMenus.create({
          'title': 'Blacklist this website',
          'parentId': 'parent',
          'id': 'blacklistWebsite'
        });
        chrome.contextMenus.create({
          'title': 'Blacklist selected word',
          'parentId': 'parent',
          'contexts': ['selection'],
          'id': 'blacklistWord'
        });
        chrome.contextMenus.create({
          'title': 'Save word to dictionary',
          'parentId': 'parent',
          'contexts': ['selection'],
          'id': 'saveWord'
        });
      });

      console.log('Starting up MindTheWord background page');
      storage = chrome.storage.local;
      currentTranslatedMap = {};
      translator = {
        translate: function translate(prefs, word) {}
      };

      googleTranslator = function googleTranslator() {};

      googleTranslator.prototype = _Object$create(translator);

      yandexTranslator = function yandexTranslator() {};

      yandexTranslator.prototype = _Object$create(translator);

      /**
       * @desc Constructs google translate url
       * @params User saved preferences
       * @params word to be translated
       * @return Google Translate query from source to destination language
       */
      googleTranslator.prototype.translate = function (prefs, word, callback) {
        var url = 'http://translate.google.com/translate_a/t?client=f&otf=1&pc=0&hl=en';
        var sL = prefs.sourceLanguage;
        if (sL != 'auto') {
          url += '&sl=' + sL;
        }
        url += '&tl=' + prefs.targetLanguage;
        url += '&text=';
        url += word;

        getData(url, function (result) {
          var tMap = {};
          for (var i in result.sentences) {
            var orig = result.sentences[i].orig;
            var origT = orig.substring(0, orig.length - 1);
            var trans = result.sentences[i].trans;
            var transT = trans.replace(/[.\u3002]/, ''); // removes punctuation
            tMap[origT] = transT;
          }
          callback(tMap);
        });
      };

      yandexTranslator.prototype.translate = function (prefs, word, callback) {
        var apikey = prefs.yandexTranslatorApiKey;

        var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + apikey;
        url += '&lang=' + prefs.sourceLanguage + '-' + prefs.targetLanguage;

        // currently a hack to create array of words, ideally it would be better to passdown an array of words.
        var words = word.split('.');
        for (var i = 0; i < words.length; i++) {
          url += '&text=' + words[i].trim(' ');
        }

        getData(url, function (result) {
          var tMap = {};
          for (var i = 0; i < words.length; i++) {
            var origT = words[i].trim(' ');
            var transT = result.text[i];
            tMap[origT] = transT;
          }
          callback(tMap);
        });
      };TranslatorFactory = {
        getTranslator: function getTranslator(type) {}
      };

      ConcreteTranslatorFactory = function ConcreteTranslatorFactory() {};

      ConcreteTranslatorFactory.prototype = _Object$create(TranslatorFactory);
      ConcreteTranslatorFactory.prototype.getTranslator = function (type) {
        if (type === 'Google Translate') {
          return new googleTranslator();
        }
        return new yandexTranslator();
      };chrome.runtime.onMessage.addListener(onMessage);chrome.contextMenus.onClicked.addListener(onClickHandler);console.log('Done setting up MindTheWord background page');

      console.log('eventPage ended');
    }
  };
});

})
(function(factory) {
  factory();
});