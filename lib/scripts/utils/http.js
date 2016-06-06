// A-> $http function is implemented in order to follow the standard Adapter pattern
// code taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Example_using_new_XMLHttpRequest()
export function http(url){

  // A small example of object
  var core = {

    // Method that performs the ajax request
    ajax : function (method, url, args, headers) {

      // Creating a promise
      var promise = new Promise( function (resolve, reject) {

        // Instantiates the XMLHttpRequest
        var client = new XMLHttpRequest();
        var uri = '';

        if (args && args.xml) {
          uri = args.payload;
        } else if (args && (method === 'POST' || method === 'PUT')) {
          // uri += '?';
          var argcount = 0;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              if (argcount++) {
                uri += '&';
              }
              uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
            }
          }
        }

        client.open(method, url);
        if (headers) {
          for (let i in headers) {
            client.setRequestHeader(i, headers[i]);
          }
        }
        client.send(uri);

        client.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            // Performs the function "resolve" when this.status is equal to 2xx
            resolve(this.response);
          } else {
            // Performs the function "reject" when this.status is different than 2xx
            reject(this.statusText);
          }
        };
        client.onerror = function () {
          reject(this.statusText);
        };
      });

      // Return the promise
      return promise;
    }
  };

  // Adapter pattern
  return {
    'get' : function(args, headers) {
      return core.ajax('GET', url, args, headers);
    },
    'post' : function(args, headers) {
      return core.ajax('POST', url, args, headers);
    },
    'put' : function(args, headers) {
      return core.ajax('PUT', url, args, headers);
    },
    'delete' : function(args, headers) {
      return core.ajax('DELETE', url, args, headers);
    }
  };
};
