import {BingTranslate} from './services/bingTranslate';
import {GoogleTranslate} from './services/googleTranslate';
import {YandexTranslate} from './services/yandexTranslate';
import {ContentScriptCtrl} from './controllers/contentScript';
import angular from 'angular';

console.log('mtw content script running');

var blacklist = [],
  srcLang = '',
  targetLang = '';

function setAttributes(html) {
  html.setAttribute('ng-app', '');
  html.setAttribute('ng-csp', '');
  document.getElementById('mtw').setAttribute('ng-controller', 'ContentScriptCtrl')
}

window.addEventListener('load', function() {
  var html = document.querySelector('html');
  document.body.innerHTML += '<div id="mtw"></div'

  setAttributes(html);

  angular.module('MTWTranslator', [])
    .service('GoogleTranslate', GoogleTranslate)
    .service('YandexTranslate', YandexTranslate)
    .service('BingTranslate', BingTranslate)
    .controller('ContentScriptCtrl', ContentScriptCtrl)

  angular.element(document).ready(function() {
    angular.bootstrap(html, ['MTWTranslator'], []);
  });
});
