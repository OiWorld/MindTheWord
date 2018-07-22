import { http } from '../utils/http';

/** Class for Common Words */
export class CommonWords {

    /**
     * Initialize options and credentials
     * @constructor
     * @param {string} srcLang - source languages
     */
    constructor(srcLang) {
        this.srcLang = srcLang;
        this.url = chrome.extension.getURL('./common/' + this.srcLang + '.json');
    }

    /**
     * Posts a request for getting common words and returns a promise.
     * @returns {Promise} - On resolution gives common words map
     */

    getCommonWords() {
        fetch(this.url)
            .then((response) => response.json())
            .then((json) => this.doSomething(json));
    
    }

    doSomething(data){
        console.log(data.words);
        return data.words;
    }
    
}