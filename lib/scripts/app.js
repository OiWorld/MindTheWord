import {ContentScript} from './contentScript';

console.log('mtw content script running');

var MTWTranslator = new ContentScript();
MTWTranslator.translate();
