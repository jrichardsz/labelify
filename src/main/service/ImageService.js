const DataValidator = require("../common/DataValidator.js");

@Service
function ImageService() {

  @Autowire(name = "imageDataSource")
  this.imageDataSource;

  @Autowire(name = "googleImageApiService")
  this.googleImageApiService;

  @Autowire(name = "annotationDataSource")
  this.annotationDataSource;

  this.bulkImageInsertFromGoogle = async (googleImageApiUrl, tag, expectedClasses, userId, annotationGroupIdentifier) => {

    DataValidator.validate(googleImageApiUrl, "googleImageApiUrl");
    DataValidator.validate(tag, "tag");
    DataValidator.validate(expectedClasses, "expectedClasses" );
    DataValidator.validate(userId, "userId");
    DataValidator.validate(annotationGroupIdentifier, "annotationGroupIdentifier");

    var imagesApiResponse = await this.googleImageApiService.getImages(googleImageApiUrl);
    if(imagesApiResponse.code!=200){
      throw new Error("google image api returns an error: "+JSON.stringify(imagesApiResponse));
    }

    if(imagesApiResponse.content.length==0){
      throw new Error("google image api returns zero images: "+JSON.stringify(imagesApiResponse));
    }

    var ids = [];
    for(image of imagesApiResponse.content){
      console.log("inserting: "+image.name);
      let imageCreationResult = await this.imageDataSource.create({
        tag:tag,
        url:"https://drive.google.com/uc?id="+image.id,
        file_name:image.name,
        expected_classes:expectedClasses
      });

      console.log("registering: "+imageCreationResult[0]);
      await this.annotationDataSource.create(userId, imageCreationResult[0], annotationGroupIdentifier);
      ids.push(imageCreationResult[0]);
    }
    return ids;

  }
}

module.exports = ImageService;
