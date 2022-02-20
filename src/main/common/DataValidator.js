function DataValidator() {}

DataValidator.validate = function(unknownValue, alias){
  if(!((unknownValue!==undefined && unknownValue !== null && unknownValue !== ''))){
    let e = Error(alias+" is undefined, null or empty");
    e.code = "REQUIRED_VALUE"
    throw e;
  }
}

module.exports = DataValidator;
