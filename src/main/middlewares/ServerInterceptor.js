@ServerInitializer

function ServerInterceptor() {

  @Autowire(name = "dbSession")
  this.dbSession;

  this.onBeforeLoad = () => {
    return new Promise(async (resolve, reject) => {
      console.log("Configuring database...");
      var existsUserTable = await this.dbSession.schema.hasTable('user');
      if (!existsUserTable) {
        return this.dbSession.schema.createTable('user', (table) => {
          table.increments('id').primary();
          table.string('username', 25).unique().notNullable();
          table.string('password', 25).notNullable();
          table.string('role', 50).notNullable();
        }).createTable('iam', function(table) {
          table.increments('id').primary();
          table.string('role', 25).notNullable();
          table.string('resource', 50).notNullable();
          table.string('permission', 150).notNullable();
        }).createTable('image', function(table) {
          table.increments('id').primary();
          table.string('group_identifier', 50).notNullable();
          table.string('url', 150).notNullable();
          table.string('file_name', 50).notNullable();
          table.string('expected_classes', 50);
        }).createTable('user_annotation_group', function(table) {
          table.integer('user_id').notNullable();
          table.string('annotation_group_identifier', 50);
        }).createTable('human_annotation', function(table) {
          table.integer('user_id').notNullable();
          table.integer('image_id').notNullable();
          table.integer('x1').notNullable();
          table.integer('y1').notNullable();
          table.integer('x2').notNullable();
          table.integer('y2').notNullable();
          table.integer('x3').notNullable();
          table.integer('y3').notNullable();
          table.integer('x4').notNullable();
          table.integer('y4').notNullable();
          table.date("insert_at").notNullable();
        }).then(async () => {
          await this.dbSession("user").insert([{
            username: "admin",
            password: "123456",
            role: "admin"
          }])
          await this.dbSession("iam").insert([{
            role: "admin",
            resource: "image",
            permission: "get-next"
          }, {
            role: "user",
            resource: "image",
            permission: "get-next"
          }])
          resolve();
        });
      } else {
        console.log("user table already exist");
        resolve();
      }
    });
  }

}

module.exports = ServerInterceptor;
