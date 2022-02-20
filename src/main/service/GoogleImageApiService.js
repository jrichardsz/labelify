const axios = require('axios');

@Service
function GoogleImageApiService() {

  this.getImages = (googleImageApiUrl) => {
    if (typeof googleImageApiUrl === 'undefined' || googleImageApiUrl == "") {
      throw new Error("google image api url is empty or null");
    }

    return new Promise((resolve, reject) => {
      axios.get(googleImageApiUrl)
        .then(function (response) {
          resolve(response.data);
        }).catch(function(err){
          reject(err);
        })
    })

  }

}

module.exports = GoogleImageApiService;
