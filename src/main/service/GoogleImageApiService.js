@Service
function GoogleImageApiService() {

  this.getImages = (googleImageApiUrl) => {
    if (typeof googleImageApiUrl === 'undefined' || googleImageApiUrl == "") {
      throw new Error("google image api url is empty or null");
    }

    return new Promise((resolve, reject) => {
      // select http or https module, depending on reqested url
      const lib = url.startsWith('https') ? require('https') : require('http');
      const request = lib.get(googleImageApiUrl, (response) => {
        // handle http errors
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed to load images from google image api, status code: ' + response.statusCode));
        }
        // temporary data holder
        const body = [];
        // on every content chunk, push it to the data array
        response.on('data', (chunk) => body.push(chunk));
        // we are done, resolve promise with those joined chunks
        response.on('end', () => resolve(body.join('')));
      });
      // handle connection errors of the request
      request.on('error', (err) => reject(err))
    })

  }

}

module.exports = GoogleImageApiService;
