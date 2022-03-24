@Route
function HealthRoute() {
  
  @Autowire(name = "dbSession")
  this.dbSession;

  @Get(path = "/health")
  this.getHealth = async (req, res) => {
    try {
      await this.dbSession.raw('SELECT 1').then();
      return res.json({
        code: 200,
        message: "success"
      })
    } catch (e) {
      console.log(e);
      return res.json({
        code: 501,
        message: e.message
      })
    }
  }

}

module.exports = HealthRoute;
