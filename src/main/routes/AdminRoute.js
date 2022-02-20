@Route(name="AdminRoute")
function AdminRoute(){

  @Autowire(name="dbSession")
  this.dbSession;

  @Get(path="/admin/image/bulk/from/google")
  this.showAdmin = (req, res) => {
    res.json({code:200});
  }
}

module.exports = AdminRoute;
