const escape = require('escape-html');

function ApiHelper() {}

ApiHelper.encodeObject = function(body){
  var newObject = {};
  for(key in body){
    newObject[key] = escape(body[key])
  }
  return newObject;
}

module.exports = ApiHelper;
