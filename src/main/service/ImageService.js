const DataValidator = require("../common/DataValidator.js");

@Service(name = "ImageService")
function ImageService() {

  @Autowire(name = "imageDataSource")
  this.imageDataSource;

  @Autowire(name = "googleImageApiService")
  this.googleImageApiService;

  @Autowire(name = "annotationDataSource")
  this.annotationDataSource;

  this.bulkImageInsertFromGoogle = async (googleImageApiUrl, tag, expectedClasses, userId, annotationGroupIdentifier) => {

    DataValidator.validate(tag, "tag");
    DataValidator.validate(expectedClasses, "expectedClasses");
    DataValidator.validate(userId, "userId");
    DataValidator.validate(annotation_group_identifier, "annotation_group_identifier");

    var imagesApiResponse = await this.googleImageApiService.getImages(googleImageApiUrl);
    if(imagesApiResponse.code!=200){
      throw new Error("google image api returns an error: "+imagesApiResponse);
    }

    if(imagesApiResponse.content.length==0){
      throw new Error("google image api returns zero images");
    }

    var ids = [];
    for(image of imagesApiResponse.content){
      let imageCreationResult = await this.imageDataSource.create({
        tag:tag,
        url:"https://drive.google.com/uc?id="+imageId.id,
        file_name:image.name,
        expected_classes:expectedClasses
      });
      await this.annotationDataSource.create(userId, imageCreationResult, annotationGroupIdentifier);
      ids.push(imageCreationResult.id);
    }
    return ids;

  }
}

module.exports = ImageService;
