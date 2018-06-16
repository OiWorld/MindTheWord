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
        this.url = 'https://storage.googleapis.com/mtw/' + this.srcLang + '.json';
    }

    /**
     * Posts a request for getting common words and returns a promise.
     * @returns {Promise} - On resolution gives common words map
     */

    getCommonWords() {
        var promise = new Promise((resolve, reject) => {
            var promises = [];
            promises.push(http(this.url).get());

            Promise.all(promises)
                .then((responses) => {
                    let cwListObj = JSON.parse(responses).words;
                    let cwList = [];
                    for (var i in cwListObj) {
                        cwList[cwListObj[i]] = 1;
                    }
                    resolve(cwList);
                })
                .catch((e) => {
                    reject(e);
                });
        });
        return promise;
    }
}