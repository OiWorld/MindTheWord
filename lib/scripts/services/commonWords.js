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
            promises = this.url;

            Promise.all(promises)
                .then((responses) => {
                    console.log(responses);
                    let cwMap = responses[words];
                    resolve(cwMap);
                })
                .catch((e) => {
                    reject(e);
                });
        });
        return promise;
    }
}