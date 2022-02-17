const jwt = require('jsonwebtoken')

@Route(name="AnnotationRoute")
function AnnotationRoute() {

  @Autowire(name = "securityDataSource")
  this.securityDataSource;

  @Autowire(name = "annotationDataSource")
  this.annotationDataSource;

  @Post(path = "/api/annotation")
  @Protected(permission = "annotation:create")
  this.createAnnotation = async (req, res) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null){
      return res.json({
        code: 401,
        message: "You are not allowed"
      });
    }

    var payload = await jwt.verify(token, process.env.TOKEN_SECRET);

    var validator = await this.securityDataSource.hasPermissions(req.session['user_details'].role, "annotation", "create");
    if(validator.has_permission === "false"){
      return res.json({
        code: 401,
        message: "You are not allowed"
      });
    }

    var user;
    try{
      user = await this.securityDataSource.findUserByName(payload.subject_id);
    }catch(err){
      return res.json({
        code: 401,
        message: "You are not allowed"
      });
    }
    var userId = user[0].id;
    var safeReceivedImageId = req.body.imageId;
    var safeReceivedAnnotationGroupIdentifier = req.body.annotationGroupIdentifier;
    var safeReceivedX1 = req.body.x1;
    var safeReceivedY1 = req.body.y1;
    var safeReceivedX2 = req.body.x2;
    var safeReceivedY2 = req.body.y2;
    var safeReceivedX3 = req.body.x3;
    var safeReceivedY3 = req.body.y3;
    var safeReceivedX4 = req.body.x4;
    var safeReceivedY4 = req.body.y4;

    var annotation = await this.annotationDataSource.findAnnotationByUserAnnotGroupIdImageId(
      userId, safeReceivedAnnotationGroupIdentifier, safeReceivedImageId)

    await this.annotationDataSource.updateAnnotation(annotation[0].id,
      safeReceivedX1,
      safeReceivedY1,
      safeReceivedX2,
      safeReceivedY2,
      safeReceivedX3,
      safeReceivedY3,
      safeReceivedX4,
      safeReceivedY4,
      new Date()
    );

    res.json({
      code: 200,
      message: "success"
    });
  }
}

module.exports = AnnotationRoute;
