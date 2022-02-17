const jwt = require('jsonwebtoken')

@Route(name="ImagesRoute")
function ImagesRoute() {

  @Autowire(name = "imageDataSource")
  this.imageDataSource;

  @Autowire(name = "securityDataSource")
  this.securityDataSource;

  //DEPRECATED
  @Get(path = "/api/image/next/2")
  @Protected(permission = "image:get-next")
  this.getNextImage = (req, res) => {
    res.json({
      code: 200,
      message: "success",
      content: {
        url: "https://drive.google.com/uc?id=1SSoRIEpMWrGZI4VaEgnTAQkpAEotiltv"
      },
    });
  }

  @Post(path = "/api/image/next")
  @Protected(permission = "image:get-next")
  this.getNextImage = async (req, res) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null){
      return res.json({
        code: 401,
        message: "You are not allowed"
      });
    }

    var payload = await jwt.verify(token, process.env.TOKEN_SECRET);

    var validator = await this.securityDataSource.hasPermissions(req.session['user_details'].role, "image", "get-next");
    if(validator.has_permission === "false"){
      return res.json({
        code: 401,
        message: "You are not allowed"
      });
    }

    var safeReceivedAnnotationGroupIdentifier = req.body.uuid;
    var safeReceivedUsername = payload.subject_id;
    var nextImage = await this.imageDataSource.findNextImage(safeReceivedAnnotationGroupIdentifier, safeReceivedUsername);
    if (!nextImage) {
      return res.json({
        code: 500,
        message: "Images cannot be retrieved"
      });
    }
    if (nextImage.length == 0) {
      return res.json({
        code: 501,
        message: "You finished with all the images"
      });
    }

    res.json({
      code: 200,
      message: "success",
      content: {
        id: nextImage[0].id,
        url: nextImage[0].url
      },
    });
  }
}

module.exports = ImagesRoute;
