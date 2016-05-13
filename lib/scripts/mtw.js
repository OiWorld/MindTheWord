import {ContentScript} from './contentScript';

console.log('mtw content script running with watching');

var MTWTranslator = new ContentScript();
MTWTranslator.translate();
