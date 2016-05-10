import {BingTranslate} from './services/bingTranslate';
import {GoogleTranslate} from './services/googleTranslate';
import {YandexTranslate} from './services/yandexTranslate';
import {ContentScriptCtrl} from './controllers/contentScript';
import angular from 'angular';

console.log('mtw content script running');

angular.module('MTWTranslator', [])
  .service('GoogleTranslate', GoogleTranslate)
  .service('YandexTranslate', YandexTranslate)
  .service('BingTranslate', BingTranslate)
  .controller('ContentScriptCtrl', ContentScriptCtrl);

var div = document.createElement('div');
var mtw = document.createElement('div');
div.dataset.ngNonBindable = '';
mtw.dataset.ngController = 'ContentScriptCtrl';
document.body.appendChild(div);
div.appendChild(mtw);

window.name = '';
angular.bootstrap(mtw, ['MTWTranslator']);
