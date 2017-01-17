const request = require('request');
const Promise = require('es6-promise').Promise;

module.exports = function () {
    return {
        sendRequest: sendRequest
    }

    function sendRequest(options) {
        return new Promise(function (resolve, reject) {
            request(options, callback);

            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(body);
                }
                else {
                    console.error(response);
                    reject('An error occured: ' + JSON.stringify(response));
                }
            }
        });
    }
}