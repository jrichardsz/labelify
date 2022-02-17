@Service

function ImageDataSource() {

  @Autowire(name = "dbSession")
  this.dbSession;

  this.findNextImageSqlString = `
  select im.id , im.url  from annotation a, user us, image im
  where a.annotation_group_identifier  = :annotation_group_identifier
  and us.username = :username
  and us.id = a.user_id
  and a.image_id = im.id
  and (a.x1 is null
  or a.y1 is null
  or a.x2 is null
  or a.y2 is null
  or a.x1 is null
  or a.y2 is null
  or a.x1 is null
  or a.y2 is null)
  LIMIT 1
  `

  this.findNextImage = (annotation_group_identifier, username) => {
    return new Promise(async (resolve, reject) => {
      try {

        var params = {
          annotation_group_identifier: annotation_group_identifier,
          username: username
        };

        var nextImage = await this.dbSession
          .raw(this.findNextImageSqlString, params);

        if (nextImage.length == 0) {
          resolve([]);
        }

        resolve(nextImage[0]);
      } catch (err) {
        console.log(err);
        reject("Failed to find next image");
      }
    });
  }

}

module.exports = ImageDataSource;
