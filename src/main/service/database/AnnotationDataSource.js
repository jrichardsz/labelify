@Service

function AnnotationDataSource() {

  @Autowire(name = "dbSession")
  this.dbSession;

  this.findAnnotationByUserAnnotGroupIdImageId = (userId, annotation_group_identifier, imageId) => {
    return new Promise(async (resolve, reject) => {
      try {
        var annotation = await this.dbSession
          .select('*')
          .from('annotation')
          .where({
            user_id: userId,
            annotation_group_identifier: annotation_group_identifier,
            image_id: imageId
          });
        resolve(annotation);
      } catch (err) {
        console.log(err);
        reject("Failed to find annotation by name");
      }
    });
  }

  this.updateAnnotation = (annotation_id, x1, y1, x2, y2, x3, y3, x4, y4, update_at) => {
    return new Promise(async (resolve, reject) => {
      try {

        await this.dbSession('annotation').where('id', annotation_id).update({
          "x1": x1,
          "y1": y1,
          "x2": x2,
          "y2": y2,
          "x3": x3,
          "y3": y3,
          "x4": x4,
          "y4": y4,
          "last_update": new Date()
        })

        resolve();
      } catch (err) {
        console.log(err);
        reject("Failed to update annotation");
      }
    });
  }

  this.create = (userId, imageId, annotationGroupIdentifier) => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.dbSession("annotation").insert({
          user_id: userId,
          image_id: imageId,
          annotation_group_identifier: annotationGroupIdentifier
        })
        resolve("success");
      } catch (err) {
        console.log(err);
        reject(new Error("Failed to create annotation. "+err.message));
      }
    });
  }

}

module.exports = AnnotationDataSource;